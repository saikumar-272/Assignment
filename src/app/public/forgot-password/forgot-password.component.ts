import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IResponseMessage } from "src/app/shared/interfaces/dto/dto-base";
import { BackendService } from "src/app/shared/services/backend.service";
import { Constants } from "src/app/shared/util/constants";
import {
  CustomFormValidators,
  validateAllFormFields,
} from "src/app/shared/util/form-validators";
import { NgbAlertModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingAdminPrivateModule } from "src/app/app-routing-admin-private.module";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    AppRoutingAdminPrivateModule],
  standalone: true,
})
export class ForgotPasswordComponent implements OnInit {
  private _otpSent: boolean = false;
  get isOtpSent(): boolean {
    return this._otpSent;
  }
  set isOtpSent(flag: boolean) {
    this._otpSent = flag;
  }

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

  private _passwordSubmissionSuccessful: boolean = false;
  get passwordSubmissionSuccessful(): boolean {
    return this._passwordSubmissionSuccessful;
  }
  set passwordSubmissionSuccessful(value: boolean) {
    this._passwordSubmissionSuccessful = value;
  }

  otpRequestForm = this.fb.group({
    loginName: ["", Validators.required],
  });
  passwordSubmissionForm = this.fb.group(
    {
      loginName: [{ value: "", disabled: true }, Validators.required],
      password: ["", Validators.required],
      retypePassword: ["", Validators.required],
      otp: ["", Validators.required],
    },
    {
      validators: CustomFormValidators.passwordMatch(
        "password",
        "retypePassword"
      ),
    }
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {}

  get loginNameForOtp() {
    return this.otpRequestForm.get("loginName");
  }
  get loginName() {
    return this.passwordSubmissionForm.get("loginName");
  }
  get password() {
    return this.passwordSubmissionForm.get("password");
  }
  get retypePassword() {
    return this.passwordSubmissionForm.get("retypePassword");
  }
  get otp() {
    return this.passwordSubmissionForm.get("otp");
  }

  async requestOtp(): Promise<void> {
    if (this.otpRequestForm.valid) {
      this.requestFailureMsg = null;
      const response: IResponseMessage =
        await this.backendService.requestOtpForResetPasswordUsingEmailId(
          this.loginNameForOtp?.value ?? ""
        );
      //const response: IResponseMessage = await this.backendService.requestOtpForResetPasswordUsingContactNo(this.loginNameForOtp?.value);
      if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        this.passwordSubmissionForm.patchValue({
          loginName: this.loginNameForOtp?.value,
        });
        this.requestSuccessMsg = `OTP has been sent to ${this.loginNameForOtp?.value}`;
        this.isOtpSent = true;
      } else {
        this.isOtpSent = false;
        this.requestFailureMsg = response.alert;
      }
    } else {
      validateAllFormFields(this.otpRequestForm);
    }
  }

  async submitPassword(): Promise<void> {
    if (this.passwordSubmissionForm.valid) {
      let loginName = this.loginName?.value ?? "";
      let newPassword = this.password?.value ?? "";
      let retypePassword = this.retypePassword?.value ?? "";
      let otp = this.otp?.value ?? "";
      const response: IResponseMessage =
        await this.backendService.resetPasswordUsingEmailId(
          loginName,
          newPassword,
          retypePassword,
          otp
        );
      //const response: IResponseMessage = await this.backendService.resetPasswordUsingContactNo(loginName, newPassword, retypePassword, otp);
      if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        this.passwordSubmissionSuccessful = true;
        this.requestSuccessMsg = response.alert;
        this.requestFailureMsg = null;
      } else {
        this.requestSuccessMsg = null;
        this.requestFailureMsg = response.alert;
      }
    } else {
      validateAllFormFields(this.passwordSubmissionForm);
    }
  }
}
