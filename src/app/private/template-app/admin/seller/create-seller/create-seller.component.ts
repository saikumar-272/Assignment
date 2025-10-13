import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {ICreateSellerRequestModel} from "src/app/shared/interfaces/dto/template-app/seller/create-seller";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {DropDownOption} from "src/app/shared/interfaces/dropdown_option";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
@Component({
selector: "app-create-seller",
  templateUrl: "./create-seller.component.html",
  styleUrls: ["./create-seller.component.scss"],
  imports: [AdminChildSectionFormComponent,  CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class CreateSellerComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Seller";
  pageErrors: any = [];
  isCreateSellerButtonDisabled = false;
  createSellerSectionFields: any = [];
  createSellerSectionData: any = {};
  createSellerSelectOptionsData: any = {};
  pageComponentReference: any;
  createSellerLookupDisplayTextMap: any = {};

  createSeller_sourceTypeOptions: DropDownOption[];
  sectionsShowHideInfo = {
    enableCreateSellerSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createSeller"];
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
    this.createSeller_sourceTypeOptions = [
      { id: "Buyer", value: "Buyer" },
      { id: "Agent", value: "Agent" }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createSeller",
      this.toastNotificationService,
      this.backendService
    );

    let createSellerRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createSeller",
        this.backendService,
        this.toastNotificationService
      );
    this.createSellerSectionFields = this.getSectionFieldsFromApiRequestParams(
      "CreateSeller",
      createSellerRequestParamList,
      this
    );
    this.setDataToFormOnload(
      "createSeller",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createSeller",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createSeller() {
    this.isCreateSellerButtonDisabled = true;
    this.resetFormErrors("createSeller");
    this.pageErrors = [];
    const requestModel: ICreateSellerRequestModel = {
      sourceType: this.getComboParameterValue(
        this.createSellerSectionData["sourceType"]
      ),
      sourceUUID: this.createSellerSectionData["sourceUUID"],
      firstName: this.createSellerSectionData["firstName"],
      lastName: this.createSellerSectionData["lastName"],
      dispatchAddress: this.createSellerSectionData["dispatchAddress"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateSellerButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createSeller",
      requestModel,
      this.createSellerSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createSeller(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createSellerSectionFields = [];
      if (
        !this.doAfterSave(
          "createSeller",
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
      this.router.navigate(["/in/retrieve-seller"], {
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
          "createSeller",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateSellerButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createSeller")
      this.createSellerLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createSeller") {
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
    let apiFieldList = [...this.createSellerSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createSellerSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {
    this.createSellerSelectOptionsData["sourceType"] =
      OptionsList.SellerDataSourceType;
  }
}
