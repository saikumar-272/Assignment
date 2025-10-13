import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateCounryForUploadRequestModel
} from 'src/app/shared/interfaces/dto/template-app/counry-for-upload/update-counry-for-upload';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-counry-for-upload',
  templateUrl: './update-counry-for-upload.component.html',
  styleUrls: ['./update-counry-for-upload.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule],
  standalone: true
})
export class UpdateCounryForUploadComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Country'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateCounryForUploadButtonDisabled = false;
  updateCounryForUploadSectionFields: any = [];
  updateCounryForUploadSectionData: any = {};
  updateCounryForUploadSelectOptionsData: any = {};
  updateCounryForUploadSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateCounryForUploadLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedCounryForUploadUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateCounryForUploadSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateCounryForUpload"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedCounryForUploadUUID = params['id'];
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
    var pageApiName = 'updateCounryForUpload';
    if (this.selectedCounryForUploadUUID && this.selectedCounryForUploadUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveCounryForUpload(this.selectedCounryForUploadUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateCounryForUpload", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateCounryForUploadRequestParamList = await this.getApiRequestParameterListCustom('updateCounryForUpload', this.backendService, this.toastNotificationService);
      this.updateCounryForUploadSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateCounryForUpload', updateCounryForUploadRequestParamList, this);
      this.modifyData("updateCounryForUpload", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);



    }
  }





  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateCounryForUploadSectionData = retrievedObjectInfo;
        this.updateCounryForUploadLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateCounryForUpload", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateCounryForUpload", this, retrievedObjectInfo);
   }, 100)
  }
  async updateCounryForUpload()
  {
    this.isUpdateCounryForUploadButtonDisabled = true;
    this.resetFormErrors("updateCounryForUpload");
    this.pageErrors = []
    const requestModel: IUpdateCounryForUploadRequestModel =
    {
      counryForUploadUUID : this.selectedCounryForUploadUUID,
        name: this.updateCounryForUploadSectionData['name'],
        code: this.updateCounryForUploadSectionData['code'],
    };
    this.getUpdatedPayload("updateCounryForUpload", requestModel, this.updateCounryForUploadSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateCounryForUploadButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateCounryForUpload(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateCounryForUpload", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('updateCounryForUpload', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateCounryForUploadButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateCounryForUpload")
      this.updateCounryForUploadLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateCounryForUpload')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateCounryForUploadSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateCounryForUploadSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }


  updateSelectOptionsData()
  {
  }
}
