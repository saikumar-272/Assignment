import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
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
    IUpdatePasswordForFacultyRequestModel
} from 'src/app/shared/interfaces/dto/template-app/faculty/update-password-for-faculty';
import {
    IUpdateProfileDetailsForFacultyRequestModel
} from 'src/app/shared/interfaces/dto/template-app/faculty/update-profile-details-for-faculty';
import {
    IUpdateSelfServiceAccessForFacultyRequestModel
} from 'src/app/shared/interfaces/dto/template-app/faculty/update-self-service-access-for-faculty';


import OptionsList from 'src/app/shared/forms-custom/OptionsList.json';

@Component({
selector: 'app-retrieve-faculty',
  templateUrl: './retrieve-faculty.component.html',
  styleUrls: ['./retrieve-faculty.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule],
  standalone: true
})
export class RetrieveFacultyComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Faculty'
  userActions : Array<any> = [];
  retrieveFacultyFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params
  isUpdatePasswordForFacultyButtonDisabled = false;
  isUpdatePasswordForFacultyEnabled = true;
  updatePasswordForFacultyForm = new FormGroup({});
  updatePasswordForFacultyModel: any = {};
  updatePasswordForFacultyFields: FormlyFieldConfig[] = [];
  updatePasswordForFacultyLookupDisplayTextMap: any = {};

  updatePasswordForFacultySectionFields: any = [];
  updatePasswordForFacultySectionData: any = {};
  updatePasswordForFacultySelectOptionsData: any = {};
  updatePasswordForFacultySelectedLookupsDataListObj: any = {};
  isUpdateEmailIdForFacultyButtonDisabled = false;
  isUpdateEmailIdForFacultyEnabled = true;
  updateEmailIdForFacultyForm = new FormGroup({});
  updateEmailIdForFacultyModel: any = {};
  updateEmailIdForFacultyFields: FormlyFieldConfig[] = [];
  updateEmailIdForFacultyLookupDisplayTextMap: any = {};

  updateEmailIdForFacultySectionFields: any = [];
  updateEmailIdForFacultySectionData: any = {};
  updateEmailIdForFacultySelectOptionsData: any = {};
  updateEmailIdForFacultySelectedLookupsDataListObj: any = {};
  isUpdateContactNoForFacultyButtonDisabled = false;
  isUpdateContactNoForFacultyEnabled = true;
  updateContactNoForFacultyForm = new FormGroup({});
  updateContactNoForFacultyModel: any = {};
  updateContactNoForFacultyFields: FormlyFieldConfig[] = [];
  updateContactNoForFacultyLookupDisplayTextMap: any = {};

  updateContactNoForFacultySectionFields: any = [];
  updateContactNoForFacultySectionData: any = {};
  updateContactNoForFacultySelectOptionsData: any = {};
  updateContactNoForFacultySelectedLookupsDataListObj: any = {};
  isUpdateProfileDetailsForFacultyButtonDisabled = false;
  isUpdateProfileDetailsForFacultyEnabled = true;
  updateProfileDetailsForFacultyForm = new FormGroup({});
  updateProfileDetailsForFacultyModel: any = {};
  updateProfileDetailsForFacultyFields: FormlyFieldConfig[] = [];
  updateProfileDetailsForFacultyLookupDisplayTextMap: any = {};

  updateProfileDetailsForFacultySectionFields: any = [];
  updateProfileDetailsForFacultySectionData: any = {};
  updateProfileDetailsForFacultySelectOptionsData: any = {};
  updateProfileDetailsForFacultySelectedLookupsDataListObj: any = {};
  isUpdateFacultyFirstNameButtonDisabled = false;
  isUpdateFacultyFirstNameEnabled = true;
  updateFacultyFirstNameForm = new FormGroup({});
  updateFacultyFirstNameModel: any = {};
  updateFacultyFirstNameFields: FormlyFieldConfig[] = [];
  updateFacultyFirstNameLookupDisplayTextMap: any = {};

  updateFacultyFirstNameSectionFields: any = [];
  updateFacultyFirstNameSectionData: any = {};
  updateFacultyFirstNameSelectOptionsData: any = {};
  updateFacultyFirstNameSelectedLookupsDataListObj: any = {};
  isUpdateSelfServiceAccessForFacultyButtonDisabled = false;
  isUpdateSelfServiceAccessForFacultyEnabled = true;
  updateSelfServiceAccessForFacultyForm = new FormGroup({});
  updateSelfServiceAccessForFacultyModel: any = {};
  updateSelfServiceAccessForFacultyFields: FormlyFieldConfig[] = [];
  updateSelfServiceAccessForFacultyLookupDisplayTextMap: any = {};

  updateSelfServiceAccessForFacultySectionFields: any = [];
  updateSelfServiceAccessForFacultySectionData: any = {};
  updateSelfServiceAccessForFacultySelectOptionsData: any = {};
  updateSelfServiceAccessForFacultySelectedLookupsDataListObj: any = {};

  selectedFacultyUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveFacultySection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveFaculty"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedFacultyUUID = params['id'];
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
      if (!(this.selectedFacultyUUID && this.selectedFacultyUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveFaculty(this.selectedFacultyUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveFaculty", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveFaculty');

      //Load page fields
      let retrieveFacultyResponseParamList = await this.getApiResponseParameterListCustom('retrieveFaculty', this.backendService, this.toastNotificationService);
      this.retrieveFacultyFieldList = this.getRetrievePageSectionFieldListCustom('retrieveFaculty', "RetrieveFaculty", retrieveFacultyResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveFaculty", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveFaculty", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields
      let updatePasswordForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updatePasswordForFaculty', this.backendService, this.toastNotificationService);
    this.updatePasswordForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updatePasswordForFaculty', updatePasswordForFacultyRequestParamList, this);
      let updateEmailIdForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateEmailIdForFaculty', this.backendService, this.toastNotificationService);
    this.updateEmailIdForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateEmailIdForFaculty', updateEmailIdForFacultyRequestParamList, this);
      let updateContactNoForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateContactNoForFaculty', this.backendService, this.toastNotificationService);
    this.updateContactNoForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateContactNoForFaculty', updateContactNoForFacultyRequestParamList, this);
      let updateProfileDetailsForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateProfileDetailsForFaculty', this.backendService, this.toastNotificationService);
    this.updateProfileDetailsForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateProfileDetailsForFaculty', updateProfileDetailsForFacultyRequestParamList, this);
      let updateFacultyFirstNameRequestParamList = await this.getApiRequestParameterListCustom('updateFacultyFirstName', this.backendService, this.toastNotificationService);
    this.updateFacultyFirstNameSectionFields = this.getSectionFieldsFromApiRequestParams('updateFacultyFirstName', updateFacultyFirstNameRequestParamList, this);
      let updateSelfServiceAccessForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateSelfServiceAccessForFaculty', this.backendService, this.toastNotificationService);
    this.updateSelfServiceAccessForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateSelfServiceAccessForFaculty', updateSelfServiceAccessForFacultyRequestParamList, this);


  }


  //Start User actions
  async openUpdatePasswordForFacultyPopup(modal: any)
  {
    this.updatePasswordForFacultySectionFields = [];
    this.updatePasswordForFacultySectionData = {};
    let updatePasswordForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updatePasswordForFaculty', this.backendService, this.toastNotificationService);
    this.updatePasswordForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updatePasswordForFaculty', updatePasswordForFacultyRequestParamList, this);
    this.setUpdatePasswordForFacultySelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updatePasswordForFacultyLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updatePasswordForFacultySectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updatePasswordForFacultyForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-password-for-faculty-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updatePasswordForFacultyForm.reset();
    }, (reason) => {
    this.updatePasswordForFacultyForm.reset();
    });
  }
  async openUpdateEmailIdForFacultyPopup(modal: any)
  {
    this.updateEmailIdForFacultySectionFields = [];
    this.updateEmailIdForFacultySectionData = {};
    let updateEmailIdForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateEmailIdForFaculty', this.backendService, this.toastNotificationService);
    this.updateEmailIdForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateEmailIdForFaculty', updateEmailIdForFacultyRequestParamList, this);
    this.setUpdateEmailIdForFacultySelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updateEmailIdForFacultyLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updateEmailIdForFacultySectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updateEmailIdForFacultyForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-email-id-for-faculty-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateEmailIdForFacultyForm.reset();
    }, (reason) => {
    this.updateEmailIdForFacultyForm.reset();
    });
  }
  async openUpdateContactNoForFacultyPopup(modal: any)
  {
    this.updateContactNoForFacultySectionFields = [];
    this.updateContactNoForFacultySectionData = {};
    let updateContactNoForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateContactNoForFaculty', this.backendService, this.toastNotificationService);
    this.updateContactNoForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateContactNoForFaculty', updateContactNoForFacultyRequestParamList, this);
    this.setUpdateContactNoForFacultySelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updateContactNoForFacultyLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updateContactNoForFacultySectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updateContactNoForFacultyForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-contact-no-for-faculty-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateContactNoForFacultyForm.reset();
    }, (reason) => {
    this.updateContactNoForFacultyForm.reset();
    });
  }
  async openUpdateProfileDetailsForFacultyPopup(modal: any)
  {
    this.updateProfileDetailsForFacultySectionFields = [];
    this.updateProfileDetailsForFacultySectionData = {};
    let updateProfileDetailsForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateProfileDetailsForFaculty', this.backendService, this.toastNotificationService);
    this.updateProfileDetailsForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateProfileDetailsForFaculty', updateProfileDetailsForFacultyRequestParamList, this);
    this.setUpdateProfileDetailsForFacultySelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updateProfileDetailsForFacultyLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updateProfileDetailsForFacultySectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updateProfileDetailsForFacultyForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-profile-details-for-faculty-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateProfileDetailsForFacultyForm.reset();
    }, (reason) => {
    this.updateProfileDetailsForFacultyForm.reset();
    });
  }
  async openUpdateFacultyFirstNamePopup(modal: any)
  {
    this.updateFacultyFirstNameSectionFields = [];
    this.updateFacultyFirstNameSectionData = {};
    let updateFacultyFirstNameRequestParamList = await this.getApiRequestParameterListCustom('updateFacultyFirstName', this.backendService, this.toastNotificationService);
    this.updateFacultyFirstNameSectionFields = this.getSectionFieldsFromApiRequestParams('updateFacultyFirstName', updateFacultyFirstNameRequestParamList, this);
    this.setUpdateFacultyFirstNameSelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updateFacultyFirstNameLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updateFacultyFirstNameSectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updateFacultyFirstNameForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-faculty-first-name-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateFacultyFirstNameForm.reset();
    }, (reason) => {
    this.updateFacultyFirstNameForm.reset();
    });
  }
  async openUpdateSelfServiceAccessForFacultyPopup(modal: any)
  {
    this.updateSelfServiceAccessForFacultySectionFields = [];
    this.updateSelfServiceAccessForFacultySectionData = {};
    let updateSelfServiceAccessForFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateSelfServiceAccessForFaculty', this.backendService, this.toastNotificationService);
    this.updateSelfServiceAccessForFacultySectionFields = this.getSectionFieldsFromApiRequestParams('updateSelfServiceAccessForFaculty', updateSelfServiceAccessForFacultyRequestParamList, this);
    this.setUpdateSelfServiceAccessForFacultySelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.updateSelfServiceAccessForFacultyLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.updateSelfServiceAccessForFacultySectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.updateSelfServiceAccessForFacultyForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'update-self-service-access-for-faculty-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateSelfServiceAccessForFacultyForm.reset();
    }, (reason) => {
    this.updateSelfServiceAccessForFacultyForm.reset();
    });
  }

  async updatePasswordForFaculty(modal: any)
  {
    this.isUpdatePasswordForFacultyButtonDisabled = true;
    const updatePasswordForFacultyRequestModel: IUpdatePasswordForFacultyRequestModel =
    {
      newPassword: this.updatePasswordForFacultySectionData['newPassword'],
      retypePassword: this.updatePasswordForFacultySectionData['retypePassword'],
      facultyUUID: this.selectedFacultyUUID,
    };
    const response: IResponseMessage = await this.backendService.updatePasswordForFaculty(updatePasswordForFacultyRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdatePasswordForFaculty', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdatePasswordForFacultyButtonDisabled = false;
  }
  async updateEmailIdForFaculty(modal: any)
  {
    this.isUpdateEmailIdForFacultyButtonDisabled = true;
    const facultyUUID = this.selectedFacultyUUID;
        const newEmail= this.updateEmailIdForFacultySectionData['newEmail'];
    const response: IResponseMessage = await this.backendService.updateEmailIdForFaculty(facultyUUID, newEmail);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdateEmailIdForFaculty', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmailIdForFacultyButtonDisabled = false;
  }
  async updateContactNoForFaculty(modal: any)
  {
    this.isUpdateContactNoForFacultyButtonDisabled = true;
    const facultyUUID = this.selectedFacultyUUID;
        const newContactNo= this.updateContactNoForFacultySectionData['newContactNo'];
    const response: IResponseMessage = await this.backendService.updateContactNoForFaculty(facultyUUID, newContactNo);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdateContactNoForFaculty', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateContactNoForFacultyButtonDisabled = false;
  }
  async updateProfileDetailsForFaculty(modal: any)
  {
    this.isUpdateProfileDetailsForFacultyButtonDisabled = true;
    const updateProfileDetailsForFacultyRequestModel: IUpdateProfileDetailsForFacultyRequestModel =
    {
      firstName: this.updateProfileDetailsForFacultySectionData['firstName'],
      lastName: this.updateProfileDetailsForFacultySectionData['lastName'],
      facultyUUID: this.selectedFacultyUUID,
    };
    const response: IResponseMessage = await this.backendService.updateProfileDetailsForFaculty(updateProfileDetailsForFacultyRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdateProfileDetailsForFaculty', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateProfileDetailsForFacultyButtonDisabled = false;
  }
  async updateFacultyFirstName(modal: any)
  {
    this.isUpdateFacultyFirstNameButtonDisabled = true;
    const facultyUUID = this.selectedFacultyUUID;
        const firstName= this.updateFacultyFirstNameSectionData['firstName'];
    const response: IResponseMessage = await this.backendService.updateFacultyFirstName(facultyUUID, firstName);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdateFacultyFirstName', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateFacultyFirstNameButtonDisabled = false;
  }
  async updateSelfServiceAccessForFaculty(modal: any)
  {
    this.isUpdateSelfServiceAccessForFacultyButtonDisabled = true;
    const updateSelfServiceAccessForFacultyRequestModel: IUpdateSelfServiceAccessForFacultyRequestModel =
    {
      updateType: this.getComboParameterValue(this.updateSelfServiceAccessForFacultySectionData['updateType']),
      facultyUUID: this.selectedFacultyUUID,
    };
    const response: IResponseMessage = await this.backendService.updateSelfServiceAccessForFaculty(updateSelfServiceAccessForFacultyRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('UpdateSelfServiceAccessForFaculty', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateSelfServiceAccessForFacultyButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveFaculty', this.router, {"id" : this.selectedFacultyUUID});
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
      this.doesUserHaveAccess('UpdatePasswordForFaculty') ||
      this.doesUserHaveAccess('UpdateEmailIdForFaculty') ||
      this.doesUserHaveAccess('UpdateContactNoForFaculty') ||
      this.doesUserHaveAccess('UpdateProfileDetailsForFaculty') ||
      this.doesUserHaveAccess('UpdateFacultyFirstName') ||
      this.doesUserHaveAccess('UpdateSelfServiceAccessForFaculty') ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData()
  {
    this.updateSelfServiceAccessForFacultySelectOptionsData['updateType'] = OptionsList.UpdateType;
  }
  setUpdatePasswordForFacultySelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setUpdateEmailIdForFacultySelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setUpdateContactNoForFacultySelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setUpdateProfileDetailsForFacultySelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setUpdateFacultyFirstNameSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
  setUpdateSelfServiceAccessForFacultySelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
}
