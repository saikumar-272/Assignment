import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateFlexFieldRequestModel} from 'src/app/shared/interfaces/dto/template-app/flex-field/update-flex-field';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-flex-field',
  templateUrl: './update-flex-field.component.html',
  styleUrls: ['./update-flex-field.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class UpdateFlexFieldComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Flex Field'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateFlexFieldButtonDisabled = false;
  updateFlexFieldSectionFields: any = [];
  updateFlexFieldSectionData: any = {};
  updateFlexFieldSelectOptionsData: any = {};
  updateFlexFieldSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateFlexFieldLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedFlexFieldUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateFlexFieldSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateFlexField"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedFlexFieldUUID = params['id'];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void>
  {
    this.pageComponentReference = this;
    var pageApiName = 'updateFlexField';
    if (this.selectedFlexFieldUUID && this.selectedFlexFieldUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveFlexField(this.selectedFlexFieldUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateFlexField", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateFlexFieldRequestParamList = await this.getApiRequestParameterListCustom('updateFlexField', this.backendService, this.toastNotificationService);
      this.updateFlexFieldSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateFlexField', updateFlexFieldRequestParamList, this);
      this.modifyData("updateFlexField", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);



    }
  }





  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateFlexFieldSectionData = retrievedObjectInfo;
        this.updateFlexFieldLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateFlexField", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateFlexField", this, retrievedObjectInfo);
   }, 100)
  }
  async updateFlexField()
  {
    this.isUpdateFlexFieldButtonDisabled = true;
    this.resetFormErrors("updateFlexField");
    this.pageErrors = []
    const requestModel: IUpdateFlexFieldRequestModel =
    {
      flexFieldUUID : this.selectedFlexFieldUUID,
        name: this.updateFlexFieldSectionData['name'],
        description: this.updateFlexFieldSectionData['description'],
        enableContext: this.getBooleanParameterValue(this.updateFlexFieldSectionData['enableContext']),
        globalSegmentsCount: this.updateFlexFieldSectionData['globalSegmentsCount'],
        isFrozen: this.getBooleanParameterValue(this.updateFlexFieldSectionData['isFrozen']),
    };
    this.getUpdatedPayload("updateFlexField", requestModel, this.updateFlexFieldSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateFlexFieldButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateFlexField(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateFlexField", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      window.location.reload();
    }
    else {
      if(entityUpdateResponse.errors && entityUpdateResponse.errors.length > 0) {
          if(entityUpdateResponse.alert && entityUpdateResponse.alert.length > 0) {
              toastErrorMessage = entityUpdateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityUpdateResponse.errors)
          this.populateFieldLevelErrors('updateFlexField', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateFlexFieldButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateFlexField")
      this.updateFlexFieldLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateFlexField')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateFlexFieldSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateFlexFieldSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }


  updateSelectOptionsData()
  {
  }
}
