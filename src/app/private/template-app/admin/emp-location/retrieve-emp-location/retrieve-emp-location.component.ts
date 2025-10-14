import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {Constants} from 'src/app/shared/util/constants';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {TimeZoneService} from 'src/app/shared/services/timeZone.service';
//User Actions request model
import {
    IUpdateEmpLocationNameRequestModel
} from 'src/app/shared/interfaces/dto/template-app/emp-location/update-emp-location-name';


import {RichTextEditorComponent} from 'src/app/private/editor/rich-text-editor.component';

@Component({
selector: 'app-retrieve-emp-location',
  templateUrl: './retrieve-emp-location.component.html',
  styleUrls: ['./retrieve-emp-location.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveEmpLocationComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Employee Location'
  userActions : Array<any> = [];
  retrieveEmpLocationFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params
  isUpdateEmpLocationNameButtonDisabled = false;
  isUpdateEmpLocationNameEnabled = true;
  updateEmpLocationNameForm = new FormGroup({});
  updateEmpLocationNameModel: any = {};
  updateEmpLocationNameFields: FormlyFieldConfig[] = [];
  updateEmpLocationNameLookupDisplayTextMap: any = {};

  updateEmpLocationNameSectionFields: any = [];
  updateEmpLocationNameSectionData: any = {};
  updateEmpLocationNameSelectOptionsData: any = {};
  updateEmpLocationNameSelectedLookupsDataListObj: any = {};
  isVerifyEmpLocationButtonDisabled = false;
  isVerifyEmpLocationEnabled = true;
  isSendClientRequestToTestSerializableParamsButtonDisabled = false;
  isSendClientRequestToTestSerializableParamsEnabled = true;

  selectedEmpLocationUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveEmpLocationSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  @ViewChild('angularEditorPopupCompRef') angularEditorPopupCompRef!:RichTextEditorComponent;
  editorAngularEditorInputData! : string;
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveEmpLocation"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedEmpLocationUUID = params['id'];
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
      if (!(this.selectedEmpLocationUUID && this.selectedEmpLocationUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveEmpLocation(this.selectedEmpLocationUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveEmpLocation", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveEmpLocation');

      //Load page fields
      let retrieveEmpLocationResponseParamList = await this.getApiResponseParameterListCustom('retrieveEmpLocation', this.backendService, this.toastNotificationService);
      this.retrieveEmpLocationFieldList = this.getRetrievePageSectionFieldListCustom('retrieveEmpLocation', "RetrieveEmpLocation", retrieveEmpLocationResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveEmpLocation", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveEmpLocation", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields
      let updateEmpLocationNameRequestParamList = await this.getApiRequestParameterListCustom('updateEmpLocationName', this.backendService, this.toastNotificationService);
    this.updateEmpLocationNameSectionFields = this.getSectionFieldsFromApiRequestParams('updateEmpLocationName', updateEmpLocationNameRequestParamList, this);


  }


  //Start User actions
  async openUpdateEmpLocationNamePopup(modal: any)
  {
    this.updateEmpLocationNameSectionFields = [];
    this.updateEmpLocationNameSectionData = {};
    let updateEmpLocationNameRequestParamList = await this.getApiRequestParameterListCustom('updateEmpLocationName', this.backendService, this.toastNotificationService);
    this.updateEmpLocationNameSectionFields = this.getSectionFieldsFromApiRequestParams('updateEmpLocationName', updateEmpLocationNameRequestParamList, this);
    this.setUpdateEmpLocationNameSelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updateEmpLocationNameLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updateEmpLocationNameSectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updateEmpLocationNameForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-emp-location-name-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateEmpLocationNameForm.reset();
    }, (reason) => {
    this.updateEmpLocationNameForm.reset();
    });
  }
  async openVerifyEmpLocationPopup(modal: any)
  {
    this.modalService.open(modal, { ariaLabelledBy: 'verify-emp-location-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    }, (reason) => {
    });
  }
  async openSendClientRequestToTestSerializableParamsPopup(modal: any)
  {
    this.modalService.open(modal, { ariaLabelledBy: 'send-client-request-to-test-serializable-params-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    }, (reason) => {
    });
  }

  async updateEmpLocationName(modal: any)
  {
    this.isUpdateEmpLocationNameButtonDisabled = true;
    const updateEmpLocationNameRequestModel: IUpdateEmpLocationNameRequestModel =
    {
      locationName: this.updateEmpLocationNameSectionData['locationName'],
      empLocationUUID: this.selectedEmpLocationUUID,
    };
    const response: IResponseMessage = await this.backendService.updateEmpLocationName(updateEmpLocationNameRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdateEmpLocationName', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmpLocationNameButtonDisabled = false;
  }
  async verifyEmpLocation(modal: any)
  {
    this.isVerifyEmpLocationButtonDisabled = true;
    const empLocationUUID = this.selectedEmpLocationUUID;
    const response: IResponseMessage = await this.backendService.verifyEmpLocation(empLocationUUID);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('VerifyEmpLocation', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isVerifyEmpLocationButtonDisabled = false;
  }
  async sendClientRequestToTestSerializableParams(modal: any)
  {
    this.isSendClientRequestToTestSerializableParamsButtonDisabled = true;
    const empLocationUUID = this.selectedEmpLocationUUID;
    const response: IResponseMessage = await this.backendService.sendClientRequestToTestSerializableParams(empLocationUUID);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('SendClientRequestToTestSerializableParams', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isSendClientRequestToTestSerializableParamsButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveEmpLocation', this.router, {"id" : this.selectedEmpLocationUUID});
  }
  openAngularEditorPopup(fieldName : string, sectionName: string)
  {
    let editorInputData = this.retrievedDataObject[fieldName];
    if(1>2){}
    else if(fieldName == "editor1" && sectionName == 'retrieveEmpLocation'){
      this.angularEditorPopupCompRef.showAngularEditorPopup(sectionName, fieldName, editorInputData, false);
    }
    else if(fieldName == "editor2" && sectionName == 'retrieveEmpLocation'){
      this.angularEditorPopupCompRef.showAngularEditorPopup(sectionName, fieldName, editorInputData, false);
    }
    //Action form request params
  }
  setAngularEditorPopupValue(angularEditorDataObj : any)
  {
    let processingSectionName = angularEditorDataObj['processingSectionName'];
    let processingFieldName = angularEditorDataObj['processingFieldName'];
    if(1>2){}
    //Action form request params
  }
  async onLookupValueSelected(selectedValue: any, field : any) {
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
  }
  showUserActions(): boolean {
    return (
      this.doesUserHaveAccess('UpdateEmpLocationName') ||
      this.doesUserHaveAccess('VerifyEmpLocation') ||
      this.doesUserHaveAccess('SendClientRequestToTestSerializableParams') ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData()
  {
  }
  setUpdateEmpLocationNameSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setVerifyEmpLocationSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setSendClientRequestToTestSerializableParamsSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
}
