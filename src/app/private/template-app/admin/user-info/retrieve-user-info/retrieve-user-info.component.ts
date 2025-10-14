import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {Constants} from "src/app/shared/util/constants";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
//User Actions request model
import {
    IUpdatePasswordByAdminRequestModel
} from "src/app/shared/interfaces/dto/template-app/user-info/update-password-by-admin";
import {
    IUpdateProfileDetailsSSStaffRequestModel
} from "src/app/shared/interfaces/dto/template-app/user-info/update-profile-details-ss-staff";

@Component({
selector: "app-retrieve-user-info",
  imports: [DynamicFieldDisplayComponent, AdminChildSectionFormComponent, CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./retrieve-user-info.component.html",
  styleUrls: ["./retrieve-user-info.component.scss"],
  standalone: true
})
export class RetrieveUserInfoComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Retrieve User Info";
  userActions: Array<any> = [];
  retrieveUserInfoFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params
  isUpdatePasswordByAdminButtonDisabled = false;
  isUpdatePasswordByAdminEnabled = true;
  updatePasswordByAdminForm = new FormGroup({});
  updatePasswordByAdminModel: any = {};
  updatePasswordByAdminFields: FormlyFieldConfig[] = [];
  updatePasswordByAdminLookupDisplayTextMap: any = {};

  updatePasswordByAdminSectionFields: any = [];
  updatePasswordByAdminSectionData: any = {};
  updatePasswordByAdminSelectOptionsData: any = {};
  updatePasswordByAdminSelectedLookupsDataListObj: any = {};
  isUpdateEmailByAdminButtonDisabled = false;
  isUpdateEmailByAdminEnabled = true;
  updateEmailByAdminForm = new FormGroup({});
  updateEmailByAdminModel: any = {};
  updateEmailByAdminFields: FormlyFieldConfig[] = [];
  updateEmailByAdminLookupDisplayTextMap: any = {};

  updateEmailByAdminSectionFields: any = [];
  updateEmailByAdminSectionData: any = {};
  updateEmailByAdminSelectOptionsData: any = {};
  updateEmailByAdminSelectedLookupsDataListObj: any = {};
  isUpdateContactByAdminButtonDisabled = false;
  isUpdateContactByAdminEnabled = true;
  updateContactByAdminForm = new FormGroup({});
  updateContactByAdminModel: any = {};
  updateContactByAdminFields: FormlyFieldConfig[] = [];
  updateContactByAdminLookupDisplayTextMap: any = {};

  updateContactByAdminSectionFields: any = [];
  updateContactByAdminSectionData: any = {};
  updateContactByAdminSelectOptionsData: any = {};
  updateContactByAdminSelectedLookupsDataListObj: any = {};
  isUpdateProfileDetailsSSStaffButtonDisabled = false;
  isUpdateProfileDetailsSSStaffEnabled = true;
  updateProfileDetailsSSStaffForm = new FormGroup({});
  updateProfileDetailsSSStaffModel: any = {};
  updateProfileDetailsSSStaffFields: FormlyFieldConfig[] = [];
  updateProfileDetailsSSStaffLookupDisplayTextMap: any = {};

  updateProfileDetailsSSStaffSectionFields: any = [];
  updateProfileDetailsSSStaffSectionData: any = {};
  updateProfileDetailsSSStaffSelectOptionsData: any = {};
  updateProfileDetailsSSStaffSelectedLookupsDataListObj: any = {};

  selectedUserInfoUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveUserInfoSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveUserInfo"];
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private currentRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private timeZoneService: TimeZoneService
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.selectedUserInfoUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    if (!(this.selectedUserInfoUUID && this.selectedUserInfoUUID.length > 0)) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveUserInfo(
      this.selectedUserInfoUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveUserInfo",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveUserInfo");

    //Load page fields
    let retrieveUserInfoResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveUserInfo",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUserInfoFieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveUserInfo",
      "RetrieveUserInfo",
      retrieveUserInfoResponseParamList,
      this.additionalProperties
    );
    this.doAfterPageDataLoaded(
      "retrieveUserInfo",
      this.currentRoute,
      this,
      this.retrievedDataObject
    );
    this.retrievedDataObject =
      this.updateRetrieveApiDataObjectWithInjectedFieldsData(
        this.retrievedDataObject,
        this.toastNotificationService
      );
    this.modifyData(
      "retrieveUserInfo",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
    let updatePasswordByAdminRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updatePasswordByAdmin",
        this.backendService,
        this.toastNotificationService
      );
    this.updatePasswordByAdminSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updatePasswordByAdmin",
        updatePasswordByAdminRequestParamList,
        this
      );
    let updateEmailByAdminRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmailByAdmin",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmailByAdminSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmailByAdmin",
        updateEmailByAdminRequestParamList,
        this
      );
    let updateContactByAdminRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateContactByAdmin",
        this.backendService,
        this.toastNotificationService
      );
    this.updateContactByAdminSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateContactByAdmin",
        updateContactByAdminRequestParamList,
        this
      );
    let updateProfileDetailsSSStaffRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateProfileDetailsSSStaff",
        this.backendService,
        this.toastNotificationService
      );
    this.updateProfileDetailsSSStaffSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateProfileDetailsSSStaff",
        updateProfileDetailsSSStaffRequestParamList,
        this
      );
  }

  //Start User actions
  async openUpdatePasswordByAdminPopup(modal: any) {
    this.updatePasswordByAdminSectionFields = [];
    this.updatePasswordByAdminSectionData = {};
    let updatePasswordByAdminRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updatePasswordByAdmin",
        this.backendService,
        this.toastNotificationService
      );
    this.updatePasswordByAdminSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updatePasswordByAdmin",
        updatePasswordByAdminRequestParamList,
        this
      );
    this.setUpdatePasswordByAdminSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updatePasswordByAdminLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updatePasswordByAdminSectionData = { ...this.retrievedDataObject };
      this.updatePasswordByAdminForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-password-by-admin-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updatePasswordByAdminForm.reset();
        },
        (reason) => {
          this.updatePasswordByAdminForm.reset();
        }
      );
  }
  async openUpdateEmailByAdminPopup(modal: any) {
    this.updateEmailByAdminSectionFields = [];
    this.updateEmailByAdminSectionData = {};
    let updateEmailByAdminRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmailByAdmin",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmailByAdminSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmailByAdmin",
        updateEmailByAdminRequestParamList,
        this
      );
    this.setUpdateEmailByAdminSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmailByAdminLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateEmailByAdminSectionData = { ...this.retrievedDataObject };
      this.updateEmailByAdminForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-email-by-admin-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmailByAdminForm.reset();
        },
        (reason) => {
          this.updateEmailByAdminForm.reset();
        }
      );
  }
  async openUpdateContactByAdminPopup(modal: any) {
    this.updateContactByAdminSectionFields = [];
    this.updateContactByAdminSectionData = {};
    let updateContactByAdminRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateContactByAdmin",
        this.backendService,
        this.toastNotificationService
      );
    this.updateContactByAdminSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateContactByAdmin",
        updateContactByAdminRequestParamList,
        this
      );
    this.setUpdateContactByAdminSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateContactByAdminLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateContactByAdminSectionData = { ...this.retrievedDataObject };
      this.updateContactByAdminForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-contact-by-admin-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateContactByAdminForm.reset();
        },
        (reason) => {
          this.updateContactByAdminForm.reset();
        }
      );
  }
  async openUpdateProfileDetailsSSStaffPopup(modal: any) {
    this.updateProfileDetailsSSStaffSectionFields = [];
    this.updateProfileDetailsSSStaffSectionData = {};
    let updateProfileDetailsSSStaffRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateProfileDetailsSSStaff",
        this.backendService,
        this.toastNotificationService
      );
    this.updateProfileDetailsSSStaffSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateProfileDetailsSSStaff",
        updateProfileDetailsSSStaffRequestParamList,
        this
      );
    this.setUpdateProfileDetailsSSStaffSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateProfileDetailsSSStaffLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateProfileDetailsSSStaffSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateProfileDetailsSSStaffForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-profile-details-ss-staff-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateProfileDetailsSSStaffForm.reset();
        },
        (reason) => {
          this.updateProfileDetailsSSStaffForm.reset();
        }
      );
  }

  async updatePasswordByAdmin(modal: any) {
    this.isUpdatePasswordByAdminButtonDisabled = true;
    const updatePasswordByAdminRequestModel: IUpdatePasswordByAdminRequestModel =
      {
        newPassword: this.updatePasswordByAdminSectionData["newPassword"],
        retypePassword: this.updatePasswordByAdminSectionData["retypePassword"],
        userInfoUUID: this.selectedUserInfoUUID,
      };
    const response: IResponseMessage =
      await this.backendService.updatePasswordByAdmin(
        updatePasswordByAdminRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdatePasswordByAdmin",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdatePasswordByAdminButtonDisabled = false;
  }
  async updateEmailByAdmin(modal: any) {
    this.isUpdateEmailByAdminButtonDisabled = true;
    const userInfoUUID = this.selectedUserInfoUUID;
    const newEmail = this.updateEmailByAdminSectionData["newEmail"];
    const response: IResponseMessage =
      await this.backendService.updateEmailByAdmin(userInfoUUID, newEmail);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmailByAdmin",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmailByAdminButtonDisabled = false;
  }
  async updateContactByAdmin(modal: any) {
    this.isUpdateContactByAdminButtonDisabled = true;
    const userInfoUUID = this.selectedUserInfoUUID;
    const newContactNo = this.updateContactByAdminSectionData["newContactNo"];
    const response: IResponseMessage =
      await this.backendService.updateContactByAdmin(
        userInfoUUID,
        newContactNo
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateContactByAdmin",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateContactByAdminButtonDisabled = false;
  }
  async updateProfileDetailsSSStaff(modal: any) {
    this.isUpdateProfileDetailsSSStaffButtonDisabled = true;
    const updateProfileDetailsSSStaffRequestModel: IUpdateProfileDetailsSSStaffRequestModel =
      {
        firstName: this.updateProfileDetailsSSStaffSectionData["firstName"],
        lastName: this.updateProfileDetailsSSStaffSectionData["lastName"],
      };
    const response: IResponseMessage =
      await this.backendService.updateProfileDetailsSSStaff(
        updateProfileDetailsSSStaffRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateProfileDetailsSSStaff",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateProfileDetailsSSStaffButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(actionName, "RetrieveUserInfo", this.router, {
      id: this.selectedUserInfoUUID,
    });
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {}
  showUserActions(): boolean {
    return (
      this.doesUserHaveAccess("UpdatePasswordByAdmin") ||
      this.doesUserHaveAccess("UpdateEmailByAdmin") ||
      this.doesUserHaveAccess("UpdateContactByAdmin") ||
      true ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData() {}
  setUpdatePasswordByAdminSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setUpdateEmailByAdminSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
  setUpdateContactByAdminSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
  setUpdateProfileDetailsSSStaffSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
}
