import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateNewStaffUserRequestModel
} from "src/app/shared/interfaces/dto/template-app/user-info/create-new-staff-user";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-new-staff-user",
  imports: [CommonModule, AdminChildSectionFormComponent, RouterModule, NgbModule],

  templateUrl: "./create-new-staff-user.component.html",
  styleUrls: ["./create-new-staff-user.component.scss"],
  standalone: true
})
export class CreateNewStaffUserComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Create User";
  pageErrors: any = [];
  isCreateNewStaffUserButtonDisabled = false;
  createUserInfoSectionFields: any = [];
  createUserInfoSectionData: any = {};
  createUserInfoSelectOptionsData: any = {};
  pageComponentReference: any;
  createNewStaffUserLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateUserInfoSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createUserInfo"];
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private currentRoute: ActivatedRoute
  ) {
    super();
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createNewStaffUser",
      this.toastNotificationService,
      this.backendService
    );

    let createNewStaffUserRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createNewStaffUser",
        this.backendService,
        this.toastNotificationService
      );
    this.createUserInfoSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateUserInfo",
        createNewStaffUserRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createNewStaffUser",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createNewStaffUser",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createNewStaffUser() {
    this.isCreateNewStaffUserButtonDisabled = true;
    this.resetFormErrors("createNewStaffUser");
    this.pageErrors = [];
    const requestModel: ICreateNewStaffUserRequestModel = {
      firstName: this.createUserInfoSectionData["firstName"],
      lastName: this.createUserInfoSectionData["lastName"],
      emailId: this.createUserInfoSectionData["emailId"],
      contactNo: this.createUserInfoSectionData["contactNo"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateNewStaffUserButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createNewStaffUser",
      requestModel,
      this.createUserInfoSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createNewStaffUser(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createUserInfoSectionFields = [];
      if (
        !this.doAfterSave(
          "createNewStaffUser",
          requestModel,
          entityCreateResponse,
          this,
          this.router,
          this.currentRoute,
          this.backendService,
          this.toastNotificationService
        )
      ) {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
    } else {
      if (
        entityCreateResponse.errors &&
        entityCreateResponse.errors.length > 0
      ) {
        if (
          entityCreateResponse.alert &&
          entityCreateResponse.alert.length > 0
        ) {
          toastErrorMessage = entityCreateResponse.alert;
        }
        this.toastNotificationService.showError(toastErrorMessage);
        this.pageErrors = this.getPageErrors(entityCreateResponse.errors);
        this.populateFieldLevelErrors(
          "createNewStaffUser",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateNewStaffUserButtonDisabled = false;
  }
  async onLookupValueSelected(
    selectedValue: any,
    field: any,
    selectedRecord: any
  ) {
    this.updateLookupDisplayTextMap(
      field["apiName"],
      field["key"],
      selectedRecord?.value
    );
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(
    fieldApiName: string,
    fieldKey: string,
    selectedValue: any
  ) {
    if (this.toInitLower(fieldApiName) === "createNewStaffUser")
      this.createNewStaffUserLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createNewStaffUser") {
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        this.pageSectionNameList
      );
    }
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(
      apiName,
      key,
      selectedValue,
      this,
      this.pageSectionNameList
    );
  }

  hideSectionField(key: string) {
    let apiFieldList = [...this.createUserInfoSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createUserInfoSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
