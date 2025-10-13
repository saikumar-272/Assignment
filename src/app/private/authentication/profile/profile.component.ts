import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { NgbAlertModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ILoggedInUserDetails} from "src/app/shared/interfaces/dto/auth-service/auth";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, UserType} from "src/app/shared/util/constants";
import {CustomFormValidators} from "src/app/shared/util/form-validators";
import {Subject} from "rxjs";
import {
    IUpdateEmailSSApplicationUserRequestModel
} from "src/app/shared/interfaces/dto/template-app/self-service-user/update-email-ss-application-user";
import {
    IUpdateContactNoSSApplicationUserRequestModel
} from "src/app/shared/interfaces/dto/template-app/self-service-user/update-contact-no-ss-application-user";
import {
    IUpdatePasswordSSApplicationUserRequestModel
} from "src/app/shared/interfaces/dto/template-app/self-service-user/update-password-ss-application-user";
import {StaffProfileComponent} from "../staff-profile/staff-profile.component";

@Component({
selector: "app-profile",
  imports: [NgbModule, CommonModule, ReactiveFormsModule, StaffProfileComponent, NgbAlertModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  standalone: true
})
export class ProfileComponent implements OnInit {
  changeEmailIdForm: FormGroup;
  changeContactNumberForm: FormGroup;
  sendOtpForNewContactNumberForm: FormGroup;
  updatePasswordForm: FormGroup;
  currentUser: ILoggedInUserDetails | null = null;
  reloadProfileData: Subject<boolean> = new Subject<boolean>();

  activeModal: any = null;

  USER_TYPE_STAFF = UserType.STAFF;

  private _requestFailureMsg: string | null = null;
  get requestFailureMsg(): string | null {
    return this._requestFailureMsg;
  }
  set requestFailureMsg(value: string | null) {
    this._requestFailureMsg = value;
  }

  private _requestSuccessMsg: string | null = null;
  get requestSuccessMsg(): string | null {
    return this._requestSuccessMsg;
  }
  set requestSuccessMsg(value: string | null) {
    this._requestSuccessMsg = value;
  }

  constructor(
    private authService: AuthenticationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.changeEmailIdForm = this.fb.group({
      newEmailId: [
        "",
        [
          CustomFormValidators.notBlank(),
          CustomFormValidators.email(),
          CustomFormValidators.maxLength(Constants.EMAIL_ID_FIELD_MAX_LENGTH)]],
      passwordForEmailChange: ["", [CustomFormValidators.notBlank()]],
    });
    this.changeContactNumberForm = this.fb.group({
      newContactNumber: [
        "",
        [
          CustomFormValidators.notBlank(),
          CustomFormValidators.pattern(Constants.REGEX_PHONE_NUMBER)]],
      otpForNumberChange: ["", [CustomFormValidators.notBlank()]],
      passwordForNumberChange: ["", [CustomFormValidators.notBlank()]],
    });
    this.sendOtpForNewContactNumberForm = this.fb.group({
      newContactNumber: [
        "",
        [
          CustomFormValidators.notBlank(),
          CustomFormValidators.pattern(Constants.REGEX_PHONE_NUMBER)]],
    });
    this.updatePasswordForm = this.fb.group(
      {
        oldPassword: ["", [CustomFormValidators.notBlank()]],
        newPassword: ["", [CustomFormValidators.notBlank()]],
        retypePassword: ["", [CustomFormValidators.notBlank()]],
      },
      {
        validators: CustomFormValidators.passwordMatch(
          "newPassword",
          "retypePassword"
        ),
      }
    );
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  get newEmailId() {
    return this.changeEmailIdForm.get("newEmailId");
  }
  get passwordForEmailChange() {
    return this.changeEmailIdForm.get("passwordForEmailChange");
  }
  get sendOtpNewContactNumber() {
    return this.sendOtpForNewContactNumberForm.get("newContactNumber");
  }
  get newContactNumber() {
    return this.changeContactNumberForm.get("newContactNumber");
  }
  get otpForNumberChange() {
    return this.changeContactNumberForm.get("otpForNumberChange");
  }
  get passwordForNumberChange() {
    return this.changeContactNumberForm.get("passwordForNumberChange");
  }
  get oldPassword() {
    return this.updatePasswordForm.get("oldPassword");
  }
  get newPassword() {
    return this.updatePasswordForm.get("newPassword");
  }
  get retypePassword() {
    return this.updatePasswordForm.get("retypePassword");
  }

  reloadProfileDetails() {
    this.reloadProfileData.next(true);
  }

  toggleChangeEmailIdPopup(modal: any) {
    this.changeEmailIdForm.reset();
    this.requestSuccessMsg = null;
    this.requestFailureMsg = null;
    this.activeModal = this.modalService.open(modal, {
      ariaLabelledBy: "change-email-modal-title",
    });
  }

  async handleChangeEmail() {
    if (this.changeEmailIdForm.valid) {
      const emailDetails: IUpdateEmailSSApplicationUserRequestModel = {
        emailId: this.newEmailId?.value,
        password: this.passwordForEmailChange?.value,
      };
      const responseMessage: IResponseMessage =
        await this.backendService.updateEmailSSApplicationUser(emailDetails);
      if (responseMessage.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        window.alert(responseMessage.alert);
        this.reloadProfileDetails();
        this.activeModal.close("success");
      } else {
        this.requestSuccessMsg = null;
        this.requestFailureMsg = responseMessage.alert;
      }
    }
  }

  toggleSendOtpForNewContactNumberPopup(modal: any) {
    this.sendOtpForNewContactNumberForm.reset();
    this.changeContactNumberForm.reset();
    this.requestSuccessMsg = null;
    this.requestFailureMsg = null;
    this.activeModal = this.modalService.open(modal, {
      ariaLabelledBy: "send-otp-for-new-contact-number-modal-title",
    });
  }

  async handleSendOtpForNewContactNumber(modal: any) {
    if (this.sendOtpForNewContactNumberForm.valid) {
      const contactDetails = {
        newContactNo: this.sendOtpNewContactNumber?.value,
      };
      const responseMessage: IResponseMessage =
        await this.backendService.sendOtpForNewContactNumberSSApplicationUser(
          contactDetails.newContactNo
        );
      if (responseMessage.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        this.requestSuccessMsg = `OTP SMS has been sent to ${this.sendOtpNewContactNumber?.value}`;
        this.requestFailureMsg = null;
        this.activeModal.close("success");

        this.changeContactNumberForm.reset();
        this.newContactNumber?.setValue(this.sendOtpNewContactNumber?.value);
        this.activeModal = this.modalService.open(modal, {
          ariaLabelledBy: "change-contact-number-modal-title",
        });
      } else {
        this.requestSuccessMsg = null;
        this.requestFailureMsg = responseMessage.alert;
      }

      this.sendOtpForNewContactNumberForm.reset();
    }
  }

  toggleBackSendOtpForNewContactNumberPopup(modal: any) {
    this.activeModal.close("success");
    this.toggleSendOtpForNewContactNumberPopup(modal);
  }

  async handleChangeContactNumber() {
    if (this.changeContactNumberForm.valid) {
      this.requestFailureMsg = null;
      this.requestSuccessMsg = null;
      const contactDetails: IUpdateContactNoSSApplicationUserRequestModel = {
        newContactNo: this.newContactNumber?.value,
        password: this.passwordForNumberChange?.value,
      };
      const responseMessage: IResponseMessage =
        await this.backendService.updateContactNoSSApplicationUser(
          contactDetails
        );
      if (responseMessage.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        window.alert(responseMessage.alert);
        this.reloadProfileDetails();
        this.activeModal.close("success");
      } else {
        this.requestSuccessMsg = null;
        this.requestFailureMsg = responseMessage.alert;
      }
    }
  }

  toggleUpdatePasswordPopup(modal: any) {
    this.updatePasswordForm.reset();
    this.requestSuccessMsg = null;
    this.requestFailureMsg = null;
    this.activeModal = this.modalService.open(modal, {
      ariaLabelledBy: "update-password-modal-title",
    });
  }

  async handleUpdatePassword() {
    if (this.updatePasswordForm.valid) {
      const passwordDetails: IUpdatePasswordSSApplicationUserRequestModel = {
        oldPassword: this.oldPassword?.value,
        newPassword: this.newPassword?.value,
        retypePassword: this.newPassword?.value,
      };
      const responseMessage: IResponseMessage =
        await this.backendService.updatePasswordSSApplicationUser(
          passwordDetails
        );
      if (responseMessage.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        window.alert(responseMessage.alert);
        this.activeModal.close("success");
      } else {
        this.requestSuccessMsg = null;
        this.requestFailureMsg = responseMessage.alert;
      }
    }
  }
}
