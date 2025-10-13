import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateAssetRequestModel} from 'src/app/shared/interfaces/dto/template-app/asset/update-asset';
import {
    CreateApiResponseModel,
    IResponseMessage,
    RetrieveListResponseModel
} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {
    retrieveAssetComponentListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/asset-component/retrieve-asset-component-list';
import {
    IRetrieveAssetComponentDto
} from 'src/app/shared/interfaces/dto/template-app/asset-component/retrieve-asset-component';
import {
    retrieveComponentSpareListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/component-spare/retrieve-component-spare-list';
import {
    IRetrieveComponentSpareDto
} from 'src/app/shared/interfaces/dto/template-app/component-spare/retrieve-component-spare';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-asset',
  templateUrl: './update-asset.component.html',
  styleUrls: ['./update-asset.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule],
  standalone: true
})
export class UpdateAssetComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Asset'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateAssetButtonDisabled = false;
  updateAssetSectionFields: any = [];
  updateAssetSectionData: any = {};
  updateAssetSelectOptionsData: any = {};
  updateAssetSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateAssetLookupDisplayTextMap: any = {};

  isCreateAssetComponentButtonDisabled = false;
  createAssetComponentLookupDisplayTextMap: any = {};
  createAssetComponentSectionFields: any = [];
  createAssetComponentSectionData: any = {};
  createAssetComponentSelectOptionsData: any = {};
  createAssetComponentSelectedLookupsDataListObj: any = {};
  
  isUpdateAssetComponentButtonDisabled = false;
  updateAssetComponentLookupDisplayTextMap: any = {};
  updateAssetComponentSectionFields: any = [];
  updateAssetComponentSectionData: any = {};
  updateAssetComponentSelectOptionsData: any = {};
  updateAssetComponentSelectedLookupsDataListObj: any = {};
  retrieveAssetComponentListResultObjectsList: Array<any> = [];

  isCreateComponentSpareButtonDisabled = false;
  createComponentSpareLookupDisplayTextMap: any = {};
  createComponentSpareSectionFields: any = [];
  createComponentSpareSectionData: any = {};
  createComponentSpareSelectOptionsData: any = {};
  createComponentSpareSelectedLookupsDataListObj: any = {};
  
  isUpdateComponentSpareButtonDisabled = false;
  updateComponentSpareLookupDisplayTextMap: any = {};
  updateComponentSpareSectionFields: any = [];
  updateComponentSpareSectionData: any = {};
  updateComponentSpareSelectOptionsData: any = {};
  updateComponentSpareSelectedLookupsDataListObj: any = {};
  retrieveComponentSpareListResultObjectsList: Array<any> = [];

  yesNoOptions = YES_NO_OPTIONS;
  selectedAssetUUID: string = "";
  selectedAssetComponentUUID: string = "";
  selectedComponentSpareUUID: string = "";
  retrieveAssetComponentListTableColumns : Array<any> = [];
  retrieveComponentSpareListTableColumns : Array<any> = [];
  sectionsShowHideInfo = {
    enableUpdateAssetSection : true
  }
  lineItemsSectionsShowHideInfo = {
      enableRetrieveAssetComponentListSection : true,
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateAsset"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedAssetUUID = params['id'];
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
    var pageApiName = 'updateAsset';
    if (this.selectedAssetUUID && this.selectedAssetUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveAsset(this.selectedAssetUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateAsset", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let retrieveAssetComponentListResponseParamList = await this.getApiResponseParameterListCustom('retrieveAssetComponentList', this.backendService, this.toastNotificationService);
      this.retrieveAssetComponentListTableColumns = this.getListApiTableColumnListCustom('retrieveAssetComponentList', retrieveAssetComponentListResponseParamList, this);
      let retrieveComponentSpareListResponseParamList = await this.getApiResponseParameterListCustom('retrieveComponentSpareList', this.backendService, this.toastNotificationService);
      this.retrieveComponentSpareListTableColumns = this.getListApiTableColumnListCustom('retrieveComponentSpareList', retrieveComponentSpareListResponseParamList, this);
      let updateAssetRequestParamList = await this.getApiRequestParameterListCustom('updateAsset', this.backendService, this.toastNotificationService);
      this.updateAssetSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateAsset', updateAssetRequestParamList, this);
      this.modifyData("updateAsset", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      this.fetchRetrieveAssetComponentList();

      let createAssetComponentRequestParamList = await this.getApiRequestParameterListCustom('createAssetComponent', this.backendService, this.toastNotificationService);
    this.createAssetComponentSectionFields = this.getSectionFieldsFromApiRequestParams('createAssetComponent', createAssetComponentRequestParamList, this);
      
      let updateAssetComponentRequestParamList = await this.getApiRequestParameterListCustom('updateAssetComponent', this.backendService, this.toastNotificationService);
    this.updateAssetComponentSectionFields = this.getSectionFieldsFromApiRequestParams('updateAssetComponent', updateAssetComponentRequestParamList, this);
      let createComponentSpareRequestParamList = await this.getApiRequestParameterListCustom('createComponentSpare', this.backendService, this.toastNotificationService);
    this.createComponentSpareSectionFields = this.getSectionFieldsFromApiRequestParams('createComponentSpare', createComponentSpareRequestParamList, this);
      
      let updateComponentSpareRequestParamList = await this.getApiRequestParameterListCustom('updateComponentSpare', this.backendService, this.toastNotificationService);
    this.updateComponentSpareSectionFields = this.getSectionFieldsFromApiRequestParams('updateComponentSpare', updateComponentSpareRequestParamList, this);

    }
  }
  async fetchRetrieveAssetComponentList()
  {
    var searchFilter: retrieveAssetComponentListSearchFilter = <retrieveAssetComponentListSearchFilter>{};
    searchFilter.assetUUID = this.selectedAssetUUID;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveAssetComponentList(searchFilter);
    this.retrieveAssetComponentListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveAssetComponentList", this.retrieveAssetComponentListResultObjectsList, this.toastNotificationService, this.backendService);
  }
  async fetchRetrieveComponentSpareList()
  {
    var searchFilter: retrieveComponentSpareListSearchFilter = <retrieveComponentSpareListSearchFilter>{};
    searchFilter.assetComponentUUID = this.selectedAssetComponentUUID;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveComponentSpareList(searchFilter);
    this.retrieveComponentSpareListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveComponentSpareList", this.retrieveComponentSpareListResultObjectsList, this.toastNotificationService, this.backendService);
  }


  async toggleCreateAssetComponentPopup(modal: any) {
    this.createAssetComponentSectionFields = [];
    this.createAssetComponentSectionData = {};
    this.createAssetComponentLookupDisplayTextMap = {};
    let createAssetComponentRequestParamList = await this.getApiRequestParameterListCustom('createAssetComponent', this.backendService, this.toastNotificationService);
    this.createAssetComponentSectionFields = this.getSectionFieldsFromApiRequestParams('createAssetComponent', createAssetComponentRequestParamList, this);
    this.modalService.open(modal, {ariaLabelledBy: 'create-asset-component-modal-title', modalDialogClass:"modal-dialog"}).result.then(async (result) => {
        this.createAssetComponentSectionFields = [];
    }, (reason) => {
      this.createAssetComponentSectionFields = [];
    });
  }
  async toggleCreateComponentSparePopup(modal: any) {
    this.createComponentSpareSectionFields = [];
    this.createComponentSpareSectionData = {};
    this.createComponentSpareLookupDisplayTextMap = {};
    let createComponentSpareRequestParamList = await this.getApiRequestParameterListCustom('createComponentSpare', this.backendService, this.toastNotificationService);
    this.createComponentSpareSectionFields = this.getSectionFieldsFromApiRequestParams('createComponentSpare', createComponentSpareRequestParamList, this);
    this.modalService.open(modal, {ariaLabelledBy: 'create-component-spare-modal-title', modalDialogClass:"modal-dialog"}).result.then(async (result) => {
        this.createComponentSpareSectionFields = [];
    }, (reason) => {
      this.createComponentSpareSectionFields = [];
    });
  }

  async handleCreateAssetComponent(modal : any)
  {
    this.isCreateAssetComponentButtonDisabled = true;
    let request : any =
    {
      name: this.createAssetComponentSectionData['name'],
      description: this.createAssetComponentSectionData['description'],
      assetUUID : this.selectedAssetUUID
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, request);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateAssetComponentButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createAssetComponent", request, this.createAssetComponentSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const response: CreateApiResponseModel = await this.backendService.createAssetComponent(request);
    if( response.success === Constants.API_RESPONSE_TYPE_SUCCESS)
    {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveAssetComponentList();
    }
    else{
        this.toastNotificationService.showError(response.alert);
    }
    this.isCreateAssetComponentButtonDisabled = false;
  }
  async  toggleUpdateAssetComponentPopup(modal: any, selectedLineItemId : string)
  {
    this.updateAssetComponentSectionFields = [];
    this.updateAssetComponentLookupDisplayTextMap = {};
    this.selectedAssetComponentUUID = selectedLineItemId;
    let rowDataObject : IRetrieveAssetComponentDto  = await this.backendService.retrieveAssetComponent(selectedLineItemId);
    this.modifyData("updateAssetComponent", rowDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
    let updateAssetComponentRequestParamList = await this.getApiRequestParameterListCustom('updateAssetComponent', this.backendService, this.toastNotificationService);
    this.updateAssetComponentSectionFields = this.getSectionFieldsFromApiRequestParams('updateAssetComponent', updateAssetComponentRequestParamList, this);
    this.setUpdateAssetComponentSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToAssetComponentPopup(rowDataObject);
    this.modalService.open(modal, {ariaLabelledBy: 'update-asset-component-modal-title', modalDialogClass:"modal-dialog"}).result.then(async (result) => {
        this.updateAssetComponentSectionFields = [];
    }, (reason) => {
      this.updateAssetComponentSectionFields = [];
    });
  }
  setValuesToAssetComponentPopup(retrievedObjectInfo: any)
  {
    setTimeout(() => {
      this.updateAssetComponentSectionData = { ...retrievedObjectInfo};
    }, 100)
  }
  async handleCreateComponentSpare(modal : any)
  {
    this.isCreateComponentSpareButtonDisabled = true;
    let request : any =
    {
      name: this.createComponentSpareSectionData['name'],
      description: this.createComponentSpareSectionData['description'],
      assetComponentUUID : this.selectedAssetComponentUUID
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, request);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateComponentSpareButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createComponentSpare", request, this.createComponentSpareSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const response: CreateApiResponseModel = await this.backendService.createComponentSpare(request);
    if( response.success === Constants.API_RESPONSE_TYPE_SUCCESS)
    {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveComponentSpareList();
    }
    else{
        this.toastNotificationService.showError(response.alert);
    }
    this.isCreateComponentSpareButtonDisabled = false;
  }
  async  toggleUpdateComponentSparePopup(modal: any, selectedLineItemId : string)
  {
    this.updateComponentSpareSectionFields = [];
    this.updateComponentSpareLookupDisplayTextMap = {};
    this.selectedComponentSpareUUID = selectedLineItemId;
    let rowDataObject : IRetrieveComponentSpareDto  = await this.backendService.retrieveComponentSpare(selectedLineItemId);
    this.modifyData("updateComponentSpare", rowDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
    let updateComponentSpareRequestParamList = await this.getApiRequestParameterListCustom('updateComponentSpare', this.backendService, this.toastNotificationService);
    this.updateComponentSpareSectionFields = this.getSectionFieldsFromApiRequestParams('updateComponentSpare', updateComponentSpareRequestParamList, this);
    this.setUpdateComponentSpareSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToComponentSparePopup(rowDataObject);
    this.modalService.open(modal, {ariaLabelledBy: 'update-component-spare-modal-title', modalDialogClass:"modal-dialog"}).result.then(async (result) => {
        this.updateComponentSpareSectionFields = [];
    }, (reason) => {
      this.updateComponentSpareSectionFields = [];
    });
  }
  setValuesToComponentSparePopup(retrievedObjectInfo: any)
  {
    setTimeout(() => {
      this.updateComponentSpareSectionData = { ...retrievedObjectInfo};
    }, 100)
  }

  async handleUpdateAssetComponent(modal : any)
  {
    this.isUpdateAssetComponentButtonDisabled = true;
    let request : any =
    {
      assetComponentUUID: this.selectedAssetComponentUUID,
      name: this.updateAssetComponentSectionData['name'],
      description: this.updateAssetComponentSectionData['description'],
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, request);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateAssetComponentButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("updateAssetComponent", request, this.updateAssetComponentSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const response: IResponseMessage = await this.backendService.updateAssetComponent(request);
    if( response.success === Constants.API_RESPONSE_TYPE_SUCCESS)
    {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveAssetComponentList();

    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateAssetComponentButtonDisabled = false;
  }
  async handleUpdateComponentSpare(modal : any)
  {
    this.isUpdateComponentSpareButtonDisabled = true;
    let request : any =
    {
      componentSpareUUID: this.selectedComponentSpareUUID,
      name: this.updateComponentSpareSectionData['name'],
      description: this.updateComponentSpareSectionData['description'],
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, request);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateComponentSpareButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("updateComponentSpare", request, this.updateComponentSpareSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const response: IResponseMessage = await this.backendService.updateComponentSpare(request);
    if( response.success === Constants.API_RESPONSE_TYPE_SUCCESS)
    {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveComponentSpareList();

    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateComponentSpareButtonDisabled = false;
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateAssetSectionData = retrievedObjectInfo;
        this.updateAssetLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateAsset", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateAsset", this, retrievedObjectInfo);
   }, 100)
  }
  async updateAsset()
  {
    this.isUpdateAssetButtonDisabled = true;
    this.resetFormErrors("updateAsset");
    this.pageErrors = []
    const requestModel: IUpdateAssetRequestModel =
    {
      assetUUID : this.selectedAssetUUID,
        name: this.updateAssetSectionData['name'],
        description: this.updateAssetSectionData['description'],
    };
    this.getUpdatedPayload("updateAsset", requestModel, this.updateAssetSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateAssetButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateAsset(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateAsset", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('updateAsset', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateAssetButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateAsset")
      this.updateAssetLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateAsset')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateAssetSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateAssetSectionFields];
    this.displayAField(key, apiFieldList);
  }

  async showRetrieveComponentSpareListPopup(modal: any, selectedLineItemId : string)
  {
    this.selectedAssetComponentUUID = selectedLineItemId;
    this.fetchRetrieveComponentSpareList();
    this.modalService.open(modal, {modalDialogClass:"modal-dialog"}).result.then(async (result) => {
    }, (reason) => {
    });
  }
  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }

  setUpdateAssetComponentSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setUpdateComponentSpareSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }

  updateSelectOptionsData()
  {
  }
}
