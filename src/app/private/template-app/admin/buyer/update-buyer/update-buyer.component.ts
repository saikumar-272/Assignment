import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateBuyerRequestModel} from 'src/app/shared/interfaces/dto/template-app/buyer/update-buyer';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-buyer',
  templateUrl: './update-buyer.component.html',
  styleUrls: ['./update-buyer.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule],
  standalone: true
})
export class UpdateBuyerComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Buyer'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateBuyerButtonDisabled = false;
  updateBuyerSectionFields: any = [];
  updateBuyerSectionData: any = {};
  updateBuyerSelectOptionsData: any = {};
  updateBuyerSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateBuyerLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedBuyerUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateBuyerSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateBuyer"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedBuyerUUID = params['id'];
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
    var pageApiName = 'updateBuyer';
    if (this.selectedBuyerUUID && this.selectedBuyerUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveBuyer(this.selectedBuyerUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateBuyer", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateBuyerRequestParamList = await this.getApiRequestParameterListCustom('updateBuyer', this.backendService, this.toastNotificationService);
      this.updateBuyerSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateBuyer', updateBuyerRequestParamList, this);
      this.modifyData("updateBuyer", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);



    }
  }





  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateBuyerSectionData = retrievedObjectInfo;
        this.updateBuyerLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateBuyer", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateBuyer", this, retrievedObjectInfo);
   }, 100)
  }
  async updateBuyer()
  {
    this.isUpdateBuyerButtonDisabled = true;
    this.resetFormErrors("updateBuyer");
    this.pageErrors = []
    const requestModel: IUpdateBuyerRequestModel =
    {
      buyerUUID : this.selectedBuyerUUID,
        firstName: this.updateBuyerSectionData['firstName'],
        lastName: this.updateBuyerSectionData['lastName'],
        shippingAddress: this.updateBuyerSectionData['shippingAddress'],
    };
    this.getUpdatedPayload("updateBuyer", requestModel, this.updateBuyerSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateBuyerButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateBuyer(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateBuyer", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('updateBuyer', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateBuyerButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateBuyer")
      this.updateBuyerLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateBuyer')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateBuyerSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateBuyerSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }


  updateSelectOptionsData()
  {
  }
}
