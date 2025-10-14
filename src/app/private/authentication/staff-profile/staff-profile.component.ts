import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants} from "src/app/shared/util/constants";
import {CustomFormValidators, validateAllFormFields,} from "src/app/shared/util/form-validators";
import {
    IUpdateProfileDetailsSSApplicationUserRequestModel
} from "src/app/shared/interfaces/dto/template-app/self-service-user/update-profile-details-ss-application-user";

@Component({
selector: "app-staff-profile",
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: "./staff-profile.component.html",
  styleUrls: ["./staff-profile.component.scss"],
  standalone: true
})
export class StaffProfileComponent implements OnInit {
  userDetailsForm: FormGroup;
  userInfo: any;
  id: string = "";
  @Input() reloadProfileData: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthenticationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private route: Router
  ) {
    this.userDetailsForm = this.fb.group({
      generalInformation: this.fb.group({
        firstName: [
          "",
          [
            CustomFormValidators.notBlank(),
            CustomFormValidators.maxLength(Constants.NAME_FIELD_MAX_LENGTH)]],
        lastName: [
          "",
          [
            CustomFormValidators.notBlank(),
            CustomFormValidators.maxLength(Constants.NAME_FIELD_MAX_LENGTH)]],
      }),
    });
  }

  async ngOnInit(): Promise<void> {
    let userDetails: any = this.authService.currentUser;
    this.id = userDetails.userId;
    await this.setUserInfo();

    this.reloadProfileData.subscribe(async (response) => {
      if (response) {
        await this.setUserInfo();
      }
    });
  }

  async setUserInfo() {
    this.userInfo = await this.backendService.retrieveProfileDetailsSSStaff();
    if (this.userInfo.success == 0) {
      alert(this.userInfo.alert);
      return;
    }
    const { firstName, lastName } = this.userInfo;
    this.userDetailsForm
      .get("generalInformation")
      ?.patchValue({ firstName, lastName });
  }

  get firstName() {
    return this.userDetailsForm.get("generalInformation.firstName");
  }
  get lastName() {
    return this.userDetailsForm.get("generalInformation.lastName");
  }

  async saveUserDetails() {
    if (this.userDetailsForm.valid) {
      const userInfoRequestModel: IUpdateProfileDetailsSSApplicationUserRequestModel =
        {
          firstName: this.firstName?.value,
          lastName: this.lastName?.value,
        };
      const responseMessage: IResponseMessage =
        await this.backendService.updateProfileDetailsSSApplicationUser(
          userInfoRequestModel
        );
      if (responseMessage.alert) {
        alert(responseMessage.alert);
      }
      if (responseMessage.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        this.setUserInfo();
      }
    } else {
      validateAllFormFields(this.userDetailsForm);
      window.alert("** Missing required fields or invalid values entered **");
    }
  }
}
