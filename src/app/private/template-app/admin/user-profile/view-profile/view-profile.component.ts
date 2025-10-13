import { DynamicFieldDisplayComponent } from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BackendServiceTemplateApp } from "src/app/shared/services/backend.service.template-app";
import { FormFieldsTemplateAppImplComponent } from "src/app/shared/forms-custom/form-fields-template-app-impl";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IResponseMessage } from "src/app/shared/interfaces/dto/dto-base";
import { Constants } from "src/app/shared/util/constants";
import { ToastNotificationService } from "src/app/toast-notification-service";
import { TimeZoneService } from "src/app/shared/services/timeZone.service";
import { validateAttachmentSize } from "src/app/shared/util/form-validators";
//User Actions request model
import { IUploadProfilePictureRequestModel } from "src/app/shared/interfaces/dto/template-app/user-profile/upload-profile-picture";
import { IUpdateProfileDetailsSSApplicationUserRequestModel } from "src/app/shared/interfaces/dto/template-app/self-service-user/update-profile-details-ss-application-user";
import { IUpdateContactNoSSApplicationUserRequestModel } from "src/app/shared/interfaces/dto/template-app/self-service-user/update-contact-no-ss-application-user";
import { IUpdateEmailSSApplicationUserRequestModel } from "src/app/shared/interfaces/dto/template-app/self-service-user/update-email-ss-application-user";
import { IUpdatePasswordSSApplicationUserRequestModel } from "src/app/shared/interfaces/dto/template-app/self-service-user/update-password-ss-application-user";
import { IValidateLoginDetailsRequestModel } from "src/app/shared/interfaces/dto/template-app/application-user/validate-login-details";

@Component({
  selector: "app-view-profile",
  imports: [
    DynamicFieldDisplayComponent,
    AdminChildSectionFormComponent,
    CommonModule,
    NgbModule],
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.scss"],
  standalone: true,
})
export class ViewProfileComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "View Profile";
  userActions: Array<any> = [];
  retrieveApplicationUserFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params
  isUploadProfilePictureButtonDisabled = false;
  isUploadProfilePictureEnabled = true;
  uploadProfilePictureForm = new FormGroup({});
  uploadProfilePictureModel: any = {};
  uploadProfilePictureFields: FormlyFieldConfig[] = [];
  uploadProfilePictureLookupDisplayTextMap: any = {};

  uploadProfilePictureSectionFields: any = [];
  uploadProfilePictureSectionData: any = {};
  uploadProfilePictureSelectOptionsData: any = {};
  uploadProfilePictureSelectedLookupsDataListObj: any = {};
  isUpdateProfileDetailsSSApplicationUserButtonDisabled = false;
  isUpdateProfileDetailsSSApplicationUserEnabled = true;
  updateProfileDetailsSSApplicationUserForm = new FormGroup({});
  updateProfileDetailsSSApplicationUserModel: any = {};
  updateProfileDetailsSSApplicationUserFields: FormlyFieldConfig[] = [];
  updateProfileDetailsSSApplicationUserLookupDisplayTextMap: any = {};

  updateProfileDetailsSSApplicationUserSectionFields: any = [];
  updateProfileDetailsSSApplicationUserSectionData: any = {};
  updateProfileDetailsSSApplicationUserSelectOptionsData: any = {};
  updateProfileDetailsSSApplicationUserSelectedLookupsDataListObj: any = {};
  isSendOtpForNewContactNumberSSApplicationUserButtonDisabled = false;
  isSendOtpForNewContactNumberSSApplicationUserEnabled = true;
  sendOtpForNewContactNumberSSApplicationUserForm = new FormGroup({});
  sendOtpForNewContactNumberSSApplicationUserModel: any = {};
  sendOtpForNewContactNumberSSApplicationUserFields: FormlyFieldConfig[] = [];
  sendOtpForNewContactNumberSSApplicationUserLookupDisplayTextMap: any = {};

  sendOtpForNewContactNumberSSApplicationUserSectionFields: any = [];
  sendOtpForNewContactNumberSSApplicationUserSectionData: any = {};
  sendOtpForNewContactNumberSSApplicationUserSelectOptionsData: any = {};
  sendOtpForNewContactNumberSSApplicationUserSelectedLookupsDataListObj: any =
    {};
  isUpdateContactNoSSApplicationUserButtonDisabled = false;
  isUpdateContactNoSSApplicationUserEnabled = true;
  updateContactNoSSApplicationUserForm = new FormGroup({});
  updateContactNoSSApplicationUserModel: any = {};
  updateContactNoSSApplicationUserFields: FormlyFieldConfig[] = [];
  updateContactNoSSApplicationUserLookupDisplayTextMap: any = {};

  updateContactNoSSApplicationUserSectionFields: any = [];
  updateContactNoSSApplicationUserSectionData: any = {};
  updateContactNoSSApplicationUserSelectOptionsData: any = {};
  updateContactNoSSApplicationUserSelectedLookupsDataListObj: any = {};
  isUpdateEmailSSApplicationUserButtonDisabled = false;
  isUpdateEmailSSApplicationUserEnabled = true;
  updateEmailSSApplicationUserForm = new FormGroup({});
  updateEmailSSApplicationUserModel: any = {};
  updateEmailSSApplicationUserFields: FormlyFieldConfig[] = [];
  updateEmailSSApplicationUserLookupDisplayTextMap: any = {};

  updateEmailSSApplicationUserSectionFields: any = [];
  updateEmailSSApplicationUserSectionData: any = {};
  updateEmailSSApplicationUserSelectOptionsData: any = {};
  updateEmailSSApplicationUserSelectedLookupsDataListObj: any = {};
  isUpdatePasswordSSApplicationUserButtonDisabled = false;
  isUpdatePasswordSSApplicationUserEnabled = true;
  updatePasswordSSApplicationUserForm = new FormGroup({});
  updatePasswordSSApplicationUserModel: any = {};
  updatePasswordSSApplicationUserFields: FormlyFieldConfig[] = [];
  updatePasswordSSApplicationUserLookupDisplayTextMap: any = {};

  updatePasswordSSApplicationUserSectionFields: any = [];
  updatePasswordSSApplicationUserSectionData: any = {};
  updatePasswordSSApplicationUserSelectOptionsData: any = {};
  updatePasswordSSApplicationUserSelectedLookupsDataListObj: any = {};
  isValidateLoginDetailsButtonDisabled = false;
  isValidateLoginDetailsEnabled = true;
  validateLoginDetailsForm = new FormGroup({});
  validateLoginDetailsModel: any = {};
  validateLoginDetailsFields: FormlyFieldConfig[] = [];
  validateLoginDetailsLookupDisplayTextMap: any = {};

  validateLoginDetailsSectionFields: any = [];
  validateLoginDetailsSectionData: any = {};
  validateLoginDetailsSelectOptionsData: any = {};
  validateLoginDetailsSelectedLookupsDataListObj: any = {};

  selectedApplicationUserUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveApplicationUserSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveApplicationUser"];
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private currentRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private timeZoneService: TimeZoneService
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.selectedApplicationUserUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.retrievedDataObject = await this.backendService.viewProfile();
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "viewProfile",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("ViewProfile");

    //Load page fields
    let viewProfileResponseParamList =
      await this.getApiResponseParameterListCustom(
        "viewProfile",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveApplicationUserFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "viewProfile",
        "RetrieveApplicationUser",
        viewProfileResponseParamList,
        this.additionalProperties
      );
    this.doAfterPageDataLoaded(
      "viewProfile",
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
      "viewProfile",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
    let uploadProfilePictureRequestParamList =
      await this.getApiRequestParameterListCustom(
        "uploadProfilePicture",
        this.backendService,
        this.toastNotificationService
      );
    this.uploadProfilePictureSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "uploadProfilePicture",
        uploadProfilePictureRequestParamList,
        this
      );
    let updateProfileDetailsSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateProfileDetailsSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updateProfileDetailsSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateProfileDetailsSSApplicationUser",
        updateProfileDetailsSSApplicationUserRequestParamList,
        this
      );
    let sendOtpForNewContactNumberSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "sendOtpForNewContactNumberSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.sendOtpForNewContactNumberSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "sendOtpForNewContactNumberSSApplicationUser",
        sendOtpForNewContactNumberSSApplicationUserRequestParamList,
        this
      );
    let updateContactNoSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateContactNoSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updateContactNoSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateContactNoSSApplicationUser",
        updateContactNoSSApplicationUserRequestParamList,
        this
      );
    let updateEmailSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmailSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmailSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmailSSApplicationUser",
        updateEmailSSApplicationUserRequestParamList,
        this
      );
    let updatePasswordSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updatePasswordSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updatePasswordSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updatePasswordSSApplicationUser",
        updatePasswordSSApplicationUserRequestParamList,
        this
      );
    let validateLoginDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "validateLoginDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.validateLoginDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "validateLoginDetails",
        validateLoginDetailsRequestParamList,
        this
      );
  }

  //Start User actions
  async openUploadProfilePicturePopup(modal: any) {
    this.uploadProfilePictureSectionFields = [];
    this.uploadProfilePictureSectionData = {};
    let uploadProfilePictureRequestParamList =
      await this.getApiRequestParameterListCustom(
        "uploadProfilePicture",
        this.backendService,
        this.toastNotificationService
      );
    this.uploadProfilePictureSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "uploadProfilePicture",
        uploadProfilePictureRequestParamList,
        this
      );
    this.setUploadProfilePictureSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.uploadProfilePictureLookupDisplayTextMap = {};
    setTimeout(() => {
      this.uploadProfilePictureSectionData = { ...this.retrievedDataObject };
      this.uploadProfilePictureForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "upload-profile-picture-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.uploadProfilePictureForm.reset();
        },
        (reason: any) => {
          this.uploadProfilePictureForm.reset();
        }
      );
  }
  async openUpdateProfileDetailsSSApplicationUserPopup(modal: any) {
    this.updateProfileDetailsSSApplicationUserSectionFields = [];
    this.updateProfileDetailsSSApplicationUserSectionData = {};
    let updateProfileDetailsSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateProfileDetailsSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updateProfileDetailsSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateProfileDetailsSSApplicationUser",
        updateProfileDetailsSSApplicationUserRequestParamList,
        this
      );
    this.setUpdateProfileDetailsSSApplicationUserSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateProfileDetailsSSApplicationUserLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateProfileDetailsSSApplicationUserSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateProfileDetailsSSApplicationUserForm.patchValue(
        this.retrievedDataObject
      );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-profile-details-ss-application-user-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.updateProfileDetailsSSApplicationUserForm.reset();
        },
        (reason: any) => {
          this.updateProfileDetailsSSApplicationUserForm.reset();
        }
      );
  }
  async openSendOtpForNewContactNumberSSApplicationUserPopup(modal: any) {
    this.sendOtpForNewContactNumberSSApplicationUserSectionFields = [];
    this.sendOtpForNewContactNumberSSApplicationUserSectionData = {};
    let sendOtpForNewContactNumberSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "sendOtpForNewContactNumberSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.sendOtpForNewContactNumberSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "sendOtpForNewContactNumberSSApplicationUser",
        sendOtpForNewContactNumberSSApplicationUserRequestParamList,
        this
      );
    this.setSendOtpForNewContactNumberSSApplicationUserSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.sendOtpForNewContactNumberSSApplicationUserLookupDisplayTextMap = {};
    setTimeout(() => {
      this.sendOtpForNewContactNumberSSApplicationUserSectionData = {
        ...this.retrievedDataObject,
      };
      this.sendOtpForNewContactNumberSSApplicationUserForm.patchValue(
        this.retrievedDataObject
      );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy:
          "send-otp-for-new-contact-number-ss-application-user-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.sendOtpForNewContactNumberSSApplicationUserForm.reset();
        },
        (reason: any) => {
          this.sendOtpForNewContactNumberSSApplicationUserForm.reset();
        }
      );
  }
  async openUpdateContactNoSSApplicationUserPopup(modal: any) {
    this.updateContactNoSSApplicationUserSectionFields = [];
    this.updateContactNoSSApplicationUserSectionData = {};
    let updateContactNoSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateContactNoSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updateContactNoSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateContactNoSSApplicationUser",
        updateContactNoSSApplicationUserRequestParamList,
        this
      );
    this.setUpdateContactNoSSApplicationUserSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateContactNoSSApplicationUserLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateContactNoSSApplicationUserSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateContactNoSSApplicationUserForm.patchValue(
        this.retrievedDataObject
      );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-contact-no-ss-application-user-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.updateContactNoSSApplicationUserForm.reset();
        },
        (reason: any) => {
          this.updateContactNoSSApplicationUserForm.reset();
        }
      );
  }
  async openUpdateEmailSSApplicationUserPopup(modal: any) {
    this.updateEmailSSApplicationUserSectionFields = [];
    this.updateEmailSSApplicationUserSectionData = {};
    let updateEmailSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmailSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmailSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmailSSApplicationUser",
        updateEmailSSApplicationUserRequestParamList,
        this
      );
    this.setUpdateEmailSSApplicationUserSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmailSSApplicationUserLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateEmailSSApplicationUserSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateEmailSSApplicationUserForm.patchValue(
        this.retrievedDataObject
      );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-email-ss-application-user-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.updateEmailSSApplicationUserForm.reset();
        },
        (reason: any) => {
          this.updateEmailSSApplicationUserForm.reset();
        }
      );
  }
  async openUpdatePasswordSSApplicationUserPopup(modal: any) {
    this.updatePasswordSSApplicationUserSectionFields = [];
    this.updatePasswordSSApplicationUserSectionData = {};
    let updatePasswordSSApplicationUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updatePasswordSSApplicationUser",
        this.backendService,
        this.toastNotificationService
      );
    this.updatePasswordSSApplicationUserSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updatePasswordSSApplicationUser",
        updatePasswordSSApplicationUserRequestParamList,
        this
      );
    this.setUpdatePasswordSSApplicationUserSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updatePasswordSSApplicationUserLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updatePasswordSSApplicationUserSectionData = {
        ...this.retrievedDataObject,
      };
      this.updatePasswordSSApplicationUserForm.patchValue(
        this.retrievedDataObject
      );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-password-ss-application-user-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.updatePasswordSSApplicationUserForm.reset();
        },
        (reason: any) => {
          this.updatePasswordSSApplicationUserForm.reset();
        }
      );
  }
  async openValidateLoginDetailsPopup(modal: any) {
    this.validateLoginDetailsSectionFields = [];
    this.validateLoginDetailsSectionData = {};
    let validateLoginDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "validateLoginDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.validateLoginDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "validateLoginDetails",
        validateLoginDetailsRequestParamList,
        this
      );
    this.setValidateLoginDetailsSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.validateLoginDetailsLookupDisplayTextMap = {};
    setTimeout(() => {
      this.validateLoginDetailsSectionData = { ...this.retrievedDataObject };
      this.validateLoginDetailsForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "validate-login-details-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result: any) => {
          this.validateLoginDetailsForm.reset();
        },
        (reason: any) => {
          this.validateLoginDetailsForm.reset();
        }
      );
  }

  async uploadProfilePicture(modal: any) {
    this.isUploadProfilePictureButtonDisabled = true;
    const uploadProfilePictureRequestModel: IUploadProfilePictureRequestModel =
      {
        profilePicture: this.uploadProfilePictureSectionData["profilePicture"],
      };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Profile Picture",
      uploadProfilePictureRequestModel.profilePicture,
      1
    );
    if (errorMessage.length > 0) {
      this.toastNotificationService.showError(
        errorMessage,
        "Attachment size is more for below fields."
      );
      return;
    }
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      uploadProfilePictureRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUploadProfilePictureButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.uploadProfilePicture(
        uploadProfilePictureRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UploadProfilePicture",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUploadProfilePictureButtonDisabled = false;
  }
  async updateProfileDetailsSSApplicationUser(modal: any) {
    this.isUpdateProfileDetailsSSApplicationUserButtonDisabled = true;
    const updateProfileDetailsSSApplicationUserRequestModel: IUpdateProfileDetailsSSApplicationUserRequestModel =
      {
        firstName:
          this.updateProfileDetailsSSApplicationUserSectionData["firstName"],
        lastName:
          this.updateProfileDetailsSSApplicationUserSectionData["lastName"],
      };
    const response: IResponseMessage =
      await this.backendService.updateProfileDetailsSSApplicationUser(
        updateProfileDetailsSSApplicationUserRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateProfileDetailsSSApplicationUser",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateProfileDetailsSSApplicationUserButtonDisabled = false;
  }
  async sendOtpForNewContactNumberSSApplicationUser(modal: any) {
    this.isSendOtpForNewContactNumberSSApplicationUserButtonDisabled = true;
    const contactNo =
      this.sendOtpForNewContactNumberSSApplicationUserSectionData["contactNo"];
    const response: IResponseMessage =
      await this.backendService.sendOtpForNewContactNumberSSApplicationUser(
        contactNo
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "SendOtpForNewContactNumberSSApplicationUser",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isSendOtpForNewContactNumberSSApplicationUserButtonDisabled = false;
  }
  async updateContactNoSSApplicationUser(modal: any) {
    this.isUpdateContactNoSSApplicationUserButtonDisabled = true;
    const updateContactNoSSApplicationUserRequestModel: IUpdateContactNoSSApplicationUserRequestModel =
      {
        newContactNo:
          this.updateContactNoSSApplicationUserSectionData["newContactNo"],
        password: this.updateContactNoSSApplicationUserSectionData["password"],
      };
    const response: IResponseMessage =
      await this.backendService.updateContactNoSSApplicationUser(
        updateContactNoSSApplicationUserRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateContactNoSSApplicationUser",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateContactNoSSApplicationUserButtonDisabled = false;
  }
  async updateEmailSSApplicationUser(modal: any) {
    this.isUpdateEmailSSApplicationUserButtonDisabled = true;
    const updateEmailSSApplicationUserRequestModel: IUpdateEmailSSApplicationUserRequestModel =
      {
        emailId: this.updateEmailSSApplicationUserSectionData["emailId"],
        password: this.updateEmailSSApplicationUserSectionData["password"],
      };
    const response: IResponseMessage =
      await this.backendService.updateEmailSSApplicationUser(
        updateEmailSSApplicationUserRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmailSSApplicationUser",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmailSSApplicationUserButtonDisabled = false;
  }
  async updatePasswordSSApplicationUser(modal: any) {
    this.isUpdatePasswordSSApplicationUserButtonDisabled = true;
    const updatePasswordSSApplicationUserRequestModel: IUpdatePasswordSSApplicationUserRequestModel =
      {
        oldPassword:
          this.updatePasswordSSApplicationUserSectionData["oldPassword"],
        newPassword:
          this.updatePasswordSSApplicationUserSectionData["newPassword"],
        retypePassword:
          this.updatePasswordSSApplicationUserSectionData["retypePassword"],
      };
    const response: IResponseMessage =
      await this.backendService.updatePasswordSSApplicationUser(
        updatePasswordSSApplicationUserRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdatePasswordSSApplicationUser",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdatePasswordSSApplicationUserButtonDisabled = false;
  }
  async validateLoginDetails(modal: any) {
    this.isValidateLoginDetailsButtonDisabled = true;
    const validateLoginDetailsRequestModel: IValidateLoginDetailsRequestModel =
      {
        userName: this.validateLoginDetailsSectionData["userName"],
        password: this.validateLoginDetailsSectionData["password"],
        userType: this.validateLoginDetailsSectionData["userType"],
      };
    const response: IResponseMessage =
      await this.backendService.validateLoginDetails(
        validateLoginDetailsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "ValidateLoginDetails",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isValidateLoginDetailsButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(actionName, "ViewProfile", this.router, {
      id: this.selectedApplicationUserUUID,
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
      true ||
      true ||
      true ||
      true ||
      true ||
      true ||
      true ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData() {}
  setUploadProfilePictureSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
  setUpdateProfileDetailsSSApplicationUserSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setSendOtpForNewContactNumberSSApplicationUserSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setUpdateContactNoSSApplicationUserSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setUpdateEmailSSApplicationUserSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setUpdatePasswordSSApplicationUserSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setValidateLoginDetailsSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
}
