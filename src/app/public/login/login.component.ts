import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { CommonModule } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbAlert,
  NgbModal,
  NgbModalRef,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { CustomisationService } from "src/app/customisation.service";
import { FormFieldsImplComponent } from "src/app/shared/forms-custom/form-fields-impl";
import {
  IAuthCredentials,
  IAuthenticationResponse,
} from "src/app/shared/interfaces/dto/auth-service/auth";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { Constants } from "src/app/shared/util/constants";
import { validateAllFormFields } from "src/app/shared/util/form-validators";
import { ToastNotificationService } from "src/app/toast-notification-service";
import LoginFields from "src/app/public/login/LoginFields.json";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import { BackendServiceTemplateApp } from "src/app/shared/services/backend.service.template-app";
import { isBlank } from "src/app/shared/util/string-util";
import { IValidateLoginDetailsResponseModel } from "src/app/shared/interfaces/dto/template-app/application-user/validate-login-details";
import { AppRoutingAdminPrivateModule } from "src/app/app-routing-admin-private.module";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [CommonModule, AdminChildSectionFormComponent, NgbModule, ReactiveFormsModule, NgbAlert, AppRoutingAdminPrivateModule, FormsModule],
  standalone: true,
})
export class LoginComponent extends FormFieldsImplComponent implements OnInit {
  pageComponentReference: any;
  isLoginButtonDisabled = false;
  loginForm = new FormGroup({});
  loginModel: any = {};
  loginFields: FormlyFieldConfig[] = [];
  enableLogin = false;
  enableReset = false;
  enableNext = true;

  loginSectionFields: any = [];
  loginSectionData: any = {};
  loginSelectOptionsData: any = {};

  private _requestFailureMsg: string | null = null;
  get requestFailureMsg(): string | null {
    return this._requestFailureMsg;
  }
  set requestFailureMsg(value: string | null) {
    this._requestFailureMsg = value;
  }
  userTypes: string[] = ["Staff", "Faculty"];
  selectedUserType: string | null = null;
  @ViewChild("userTypePopup") userTypePopup!: TemplateRef<any>;
  private modalRef!: NgbModalRef;

  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    let loginFormFieldList: any = [];
    let loginApiRequestParamList = [...LoginFields.requestParameters];
    loginApiRequestParamList.push(...this.getAdditionalLoginFields());
    loginApiRequestParamList = this.rearrangeFields(loginApiRequestParamList);
    for (let parameterInfo of loginApiRequestParamList) {
      let fieldInfo = this.getFieldInfo(
        parameterInfo,
        "loginApi",
        "loginApi",
        null
      );
      //Add login prefix to type parameter value for login form fields
      fieldInfo.type = "login_" + fieldInfo.type;
      loginFormFieldList.push(fieldInfo);
    }
    this.loginSectionFields = loginApiRequestParamList;
    loginFormFieldList =
      this.backendService.convertPageFieldsFromApi(loginFormFieldList);
    this.loginFields = [
      {
        fieldGroupClassName: "row",
        fieldGroup: this.loginFields.concat(loginFormFieldList),
      }];
    this.updateSelectOptionsData();
  }

  async login() {
    this.isLoginButtonDisabled = true;
    if (this.loginForm.valid) {
      const loginCredentials: IAuthCredentials = {
        loginName: this.loginSectionData["loginName"],
        password: this.loginSectionData["password"],
        userType: this.loginSectionData["userType"],
      };
      this.updateWithCustomLoginParams(loginCredentials, this.loginSectionData);
      const response = <IAuthenticationResponse>(
        await this.authService.authenticateUser(loginCredentials)
      );
      if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        this.modalService.dismissAll();
        this.router.navigateByUrl(
          this.route.snapshot.queryParams["returnUrl"] || "/in"
        );
      } else {
        if (response.errorCode == Constants.ERROR_CODE_USER_TYPE_REQUIRED) {
          this.openUserTypePoup(this.userTypePopup);
        } else {
          this.modalService.dismissAll();
          this.requestFailureMsg = response.alert;
        }
      }
    } else {
      validateAllFormFields(this.loginForm);
      this.toastNotificationService.showError(
        "** Missing required fields or invalid values entered **"
      );
    }
    this.isLoginButtonDisabled = false;
  }

  openUserTypePoup(modal: any) {
    this.modalService
      .open(modal, { ariaLabelledBy: "", modalDialogClass: "modal-dialog" })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }

  updateSelectOptionsData() {
    this.loginSelectOptionsData["userType"] = OptionsList.ApplicationUserType;
  }

  async validateLoginDetails() {
    const validationDetails: any = {
      userName: this.loginSectionData["loginName"],
      password: this.loginSectionData["password"],
      userType: this.loginSectionData["userType"],
    };
    this.updateWithCustomLoginParams(validationDetails, this.loginSectionData);
    const response = <IValidateLoginDetailsResponseModel>(
      await this.backendService.validateLoginDetails(validationDetails)
    );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      if (
        response.responseCode == Constants.RESPONSE_CODE_NO_USER_FOUND ||
        response.responseCode == Constants.RESPONSE_CODE_INCORRECT_DATA
      ) {
        this.requestFailureMsg = response.responseMessage;
        return;
      } else {
        if (
          response.responseCode ==
          Constants.RESPONSE_CODE_PROCEED_WITH_AUTHENTICATION
        ) {
          this.handleLoginFormButtons(response.nextInput);
          this.updateDisplayPropertyOfLoginFields(response.nextInput);
        } else {
          this.requestFailureMsg = response.alert;
        }
      }
      this.requestFailureMsg = "";
    } else {
      this.requestFailureMsg = response.responseMessage;
    }
  }

  handleLoginFormButtons(nextInput: string) {
    if (isBlank(nextInput)) {
      this.enableLogin = true;
      this.enableNext = false;
    }
    this.enableReset = true;
  }

  updateDisplayPropertyOfLoginFields(nextInput: string) {
    // Create a new array with updated field properties (avoids mutating original)
    this.loginSectionFields = this.updateDisplayProperties(
      nextInput,
      this.loginSectionFields
    );
  }

  resetLoginDetails() {
    window.location.reload();
  }
}
