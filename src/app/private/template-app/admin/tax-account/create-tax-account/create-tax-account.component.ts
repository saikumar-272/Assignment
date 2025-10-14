import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateTaxAccountRequestModel} from "src/app/shared/interfaces/dto/template-app/tax-account/create-tax-account";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-tax-account",
  imports: [RouterModule, CommonModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./create-tax-account.component.html",
  styleUrls: ["./create-tax-account.component.scss"],
  standalone: true
})
export class CreateTaxAccountComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Tax Account";
  pageErrors: any = [];
  isCreateTaxAccountButtonDisabled = false;
  createTaxAccountSectionFields: any = [];
  createTaxAccountSectionData: any = {};
  createTaxAccountSelectOptionsData: any = {};
  pageComponentReference: any;
  createTaxAccountLookupDisplayTextMap: any = {};

  createTaxAccount_taxTypeList: any[];
  selected_createTaxAccount_taxTypeUUID: string;
  sectionsShowHideInfo = {
    enableCreateTaxAccountSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createTaxAccount"];
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
    this.createTaxAccount_taxTypeList = [];
    this.selected_createTaxAccount_taxTypeUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createTaxAccount",
      this.toastNotificationService,
      this.backendService
    );

    let createTaxAccountRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createTaxAccount",
        this.backendService,
        this.toastNotificationService
      );
    this.createTaxAccountSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateTaxAccount",
        createTaxAccountRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createTaxAccount",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createTaxAccount",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createTaxAccount() {
    this.isCreateTaxAccountButtonDisabled = true;
    this.resetFormErrors("createTaxAccount");
    this.pageErrors = [];
    const requestModel: ICreateTaxAccountRequestModel = {
      name: this.createTaxAccountSectionData["name"],
      taxTypeUUID: this.createTaxAccountSectionData["taxTypeUUID"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateTaxAccountButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createTaxAccount",
      requestModel,
      this.createTaxAccountSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createTaxAccount(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createTaxAccountSectionFields = [];
      if (
        !this.doAfterSave(
          "createTaxAccount",
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
      this.router.navigate(["/in/retrieve-tax-account"], {
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
          "createTaxAccount",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateTaxAccountButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createTaxAccount")
      this.createTaxAccountLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createTaxAccount") {
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
    let apiFieldList = [...this.createTaxAccountSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createTaxAccountSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
