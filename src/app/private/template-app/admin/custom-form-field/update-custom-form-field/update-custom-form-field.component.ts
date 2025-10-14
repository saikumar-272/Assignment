import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from 'src/app/shared/forms-custom/OptionsList.json';
import {
    IUpdateCustomFormFieldRequestModel
} from 'src/app/shared/interfaces/dto/template-app/custom-form-field/update-custom-form-field';
import {
    CreateApiResponseModel,
    IResponseMessage,
    RetrieveListResponseModel
} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {
    retrieveFormFieldApiListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/form-field-api/retrieve-form-field-api-list';
import {
    IRetrieveFormFieldApiDto
} from 'src/app/shared/interfaces/dto/template-app/form-field-api/retrieve-form-field-api';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-custom-form-field',
  templateUrl: './update-custom-form-field.component.html',
  styleUrls: ['./update-custom-form-field.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class UpdateCustomFormFieldComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Update Custom Form Field'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateCustomFormFieldButtonDisabled = false;
  updateCustomFormFieldSectionFields: any = [];
  updateCustomFormFieldSectionData: any = {};
  updateCustomFormFieldSelectOptionsData: any = {};
  updateCustomFormFieldSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateCustomFormFieldLookupDisplayTextMap: any = {};

  isCreateFormFieldApiButtonDisabled = false;
  createFormFieldApiLookupDisplayTextMap: any = {};
  createFormFieldApiSectionFields: any = [];
  createFormFieldApiSectionData: any = {};
  createFormFieldApiSelectOptionsData: any = {};
  createFormFieldApiSelectedLookupsDataListObj: any = {};
  
  isUpdateFormFieldApiButtonDisabled = false;
  updateFormFieldApiLookupDisplayTextMap: any = {};
  updateFormFieldApiSectionFields: any = [];
  updateFormFieldApiSectionData: any = {};
  updateFormFieldApiSelectOptionsData: any = {};
  updateFormFieldApiSelectedLookupsDataListObj: any = {};
  retrieveFormFieldApiListResultObjectsList: Array<any> = [];

  yesNoOptions = YES_NO_OPTIONS;
  selectedCustomFormFieldUUID: string = "";
  selectedFormFieldApiUUID: string = "";
  retrieveFormFieldApiListTableColumns : Array<any> = [];
  sectionsShowHideInfo = {
    enableUpdateCustomFormFieldSection : true
  }
  lineItemsSectionsShowHideInfo = {
      enableRetrieveFormFieldApiListSection : true,
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateCustomFormField"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedCustomFormFieldUUID = params['id'];
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
    var pageApiName = 'updateCustomFormField';
    if (this.selectedCustomFormFieldUUID && this.selectedCustomFormFieldUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveCustomFormField(this.selectedCustomFormFieldUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateCustomFormField", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let retrieveFormFieldApiListResponseParamList = await this.getApiResponseParameterListCustom('retrieveFormFieldApiList', this.backendService, this.toastNotificationService);
      this.retrieveFormFieldApiListTableColumns = this.getListApiTableColumnListCustom('retrieveFormFieldApiList', retrieveFormFieldApiListResponseParamList, this);
      let updateCustomFormFieldRequestParamList = await this.getApiRequestParameterListCustom('updateCustomFormField', this.backendService, this.toastNotificationService);
      this.updateCustomFormFieldSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateCustomFormField', updateCustomFormFieldRequestParamList, this);
      this.modifyData("updateCustomFormField", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      this.fetchRetrieveFormFieldApiList();

      let createFormFieldApiRequestParamList = await this.getApiRequestParameterListCustom('createFormFieldApi', this.backendService, this.toastNotificationService);
    this.createFormFieldApiSectionFields = this.getSectionFieldsFromApiRequestParams('createFormFieldApi', createFormFieldApiRequestParamList, this);
      
      let updateFormFieldApiRequestParamList = await this.getApiRequestParameterListCustom('updateFormFieldApi', this.backendService, this.toastNotificationService);
    this.updateFormFieldApiSectionFields = this.getSectionFieldsFromApiRequestParams('updateFormFieldApi', updateFormFieldApiRequestParamList, this);

    }
  }
  async fetchRetrieveFormFieldApiList()
  {
    var searchFilter: retrieveFormFieldApiListSearchFilter = <retrieveFormFieldApiListSearchFilter>{};
    searchFilter.customFormFieldUUID = this.selectedCustomFormFieldUUID;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveFormFieldApiList(searchFilter);
    this.retrieveFormFieldApiListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveFormFieldApiList", this.retrieveFormFieldApiListResultObjectsList, this.toastNotificationService, this.backendService);
  }


  async toggleCreateFormFieldApiPopup(modal: any) {
    this.createFormFieldApiSectionFields = [];
    this.createFormFieldApiSectionData = {};
    this.createFormFieldApiLookupDisplayTextMap = {};
    let createFormFieldApiRequestParamList = await this.getApiRequestParameterListCustom('createFormFieldApi', this.backendService, this.toastNotificationService);
    this.createFormFieldApiSectionFields = this.getSectionFieldsFromApiRequestParams('createFormFieldApi', createFormFieldApiRequestParamList, this);
    this.modalService.open(modal, {ariaLabelledBy: 'create-form-field-api-modal-title', modalDialogClass:"modal-dialog"}).result.then(async (result) => {
        this.createFormFieldApiSectionFields = [];
    }, (reason) => {
      this.createFormFieldApiSectionFields = [];
    });
  }

  async handleCreateFormFieldApi(modal : any)
  {
    this.isCreateFormFieldApiButtonDisabled = true;
    let request : any =
    {
      apiName: this.createFormFieldApiSectionData['apiName'],
      description: this.createFormFieldApiSectionData['description'],
      customFormFieldUUID : this.selectedCustomFormFieldUUID
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, request);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateFormFieldApiButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createFormFieldApi", request, this.createFormFieldApiSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const response: CreateApiResponseModel = await this.backendService.createFormFieldApi(request);
    if( response.success === Constants.API_RESPONSE_TYPE_SUCCESS)
    {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveFormFieldApiList();
    }
    else{
        this.toastNotificationService.showError(response.alert);
    }
    this.isCreateFormFieldApiButtonDisabled = false;
  }
  async  toggleUpdateFormFieldApiPopup(modal: any, selectedLineItemId : string)
  {
    this.updateFormFieldApiSectionFields = [];
    this.updateFormFieldApiLookupDisplayTextMap = {};
    this.selectedFormFieldApiUUID = selectedLineItemId;
    let rowDataObject : IRetrieveFormFieldApiDto  = await this.backendService.retrieveFormFieldApi(selectedLineItemId);
    this.modifyData("updateFormFieldApi", rowDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
    let updateFormFieldApiRequestParamList = await this.getApiRequestParameterListCustom('updateFormFieldApi', this.backendService, this.toastNotificationService);
    this.updateFormFieldApiSectionFields = this.getSectionFieldsFromApiRequestParams('updateFormFieldApi', updateFormFieldApiRequestParamList, this);
    this.setUpdateFormFieldApiSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToFormFieldApiPopup(rowDataObject);
    this.modalService.open(modal, {ariaLabelledBy: 'update-form-field-api-modal-title', modalDialogClass:"modal-dialog"}).result.then(async (result) => {
        this.updateFormFieldApiSectionFields = [];
    }, (reason) => {
      this.updateFormFieldApiSectionFields = [];
    });
  }
  setValuesToFormFieldApiPopup(retrievedObjectInfo: any)
  {
    setTimeout(() => {
      this.updateFormFieldApiSectionData = { ...retrievedObjectInfo};
    }, 100)
  }

  async handleUpdateFormFieldApi(modal : any)
  {
    this.isUpdateFormFieldApiButtonDisabled = true;
    let request : any =
    {
      formFieldApiUUID: this.selectedFormFieldApiUUID,
      apiName: this.updateFormFieldApiSectionData['apiName'],
      description: this.updateFormFieldApiSectionData['description'],
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, request);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateFormFieldApiButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("updateFormFieldApi", request, this.updateFormFieldApiSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const response: IResponseMessage = await this.backendService.updateFormFieldApi(request);
    if( response.success === Constants.API_RESPONSE_TYPE_SUCCESS)
    {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveFormFieldApiList();

    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateFormFieldApiButtonDisabled = false;
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateCustomFormFieldSectionData = retrievedObjectInfo;
        this.updateCustomFormFieldLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateCustomFormField", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateCustomFormField", this, retrievedObjectInfo);
   }, 100)
  }
  async updateCustomFormField()
  {
    this.isUpdateCustomFormFieldButtonDisabled = true;
    this.resetFormErrors("updateCustomFormField");
    this.pageErrors = []
    const requestModel: IUpdateCustomFormFieldRequestModel =
    {
      customFormFieldUUID : this.selectedCustomFormFieldUUID,
        name: this.updateCustomFormFieldSectionData['name'],
        label: this.updateCustomFormFieldSectionData['label'],
        dataType: this.getComboParameterValue(this.updateCustomFormFieldSectionData['dataType']),
    };
    this.getUpdatedPayload("updateCustomFormField", requestModel, this.updateCustomFormFieldSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateCustomFormFieldButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateCustomFormField(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateCustomFormField", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('updateCustomFormField', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateCustomFormFieldButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateCustomFormField")
      this.updateCustomFormFieldLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateCustomFormField')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateCustomFormFieldSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateCustomFormFieldSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }

  setUpdateFormFieldApiSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }

  updateSelectOptionsData()
  {
    this.updateCustomFormFieldSelectOptionsData['dataType'] = OptionsList.CustomFormFieldDataType;
  }
}
