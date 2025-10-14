import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateUserRoleRequestModel} from "src/app/shared/interfaces/dto/template-app/user-role/create-user-role";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-user-role",
  imports: [AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./create-user-role.component.html",
  styleUrls: ["./create-user-role.component.scss"],
  standalone: true
})
export class CreateUserRoleComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New User Role";
  pageErrors: any = [];
  isCreateUserRoleButtonDisabled = false;
  createUserRoleSectionFields: any = [];
  createUserRoleSectionData: any = {};
  createUserRoleSelectOptionsData: any = {};
  pageComponentReference: any;
  createUserRoleLookupDisplayTextMap: any = {};

  createUserRole_privilegeGroupList: any[];
  selected_createUserRole_privilegeGroupUUID: string;
  createUserRole_userInfoList: any[];
  selected_createUserRole_userInfoUUID: string;
  sectionsShowHideInfo = {
    enableCreateUserRoleSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createUserRole"];
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
    this.createUserRole_privilegeGroupList = [];
    this.selected_createUserRole_privilegeGroupUUID = "";
    this.createUserRole_userInfoList = [];
    this.selected_createUserRole_userInfoUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createUserRole",
      this.toastNotificationService,
      this.backendService
    );

    let createUserRoleRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createUserRole",
        this.backendService,
        this.toastNotificationService
      );
    this.createUserRoleSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateUserRole",
        createUserRoleRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createUserRole",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createUserRole",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createUserRole() {
    this.isCreateUserRoleButtonDisabled = true;
    this.resetFormErrors("createUserRole");
    this.pageErrors = [];
    const requestModel: ICreateUserRoleRequestModel = {
      privilegeGroupUUID: this.createUserRoleSectionData["privilegeGroupUUID"],
      description: this.createUserRoleSectionData["description"],
      userInfoUUID: this.createUserRoleSectionData["userInfoUUID"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateUserRoleButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createUserRole",
      requestModel,
      this.createUserRoleSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createUserRole(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createUserRoleSectionFields = [];
      if (
        !this.doAfterSave(
          "createUserRole",
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
      this.router.navigate(["/in/retrieve-user-role"], {
        queryParams: { id: entityCreateResponse.uuid },
      });
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
          "createUserRole",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateUserRoleButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createUserRole")
      this.createUserRoleLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createUserRole") {
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
    let apiFieldList = [...this.createUserRoleSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createUserRoleSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
