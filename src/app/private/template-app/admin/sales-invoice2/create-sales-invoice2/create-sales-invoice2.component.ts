import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {
    ICreateSalesInvoice2RequestModel
} from "src/app/shared/interfaces/dto/template-app/sales-invoice2/create-sales-invoice2";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {DropDownOption} from "src/app/shared/interfaces/dropdown_option";

import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
@Component({
selector: "app-create-sales-invoice2",
  templateUrl: "./create-sales-invoice2.component.html",
  styleUrls: ["./create-sales-invoice2.component.scss"],
  imports: [AdminChildSectionFormComponent, RetrieveEmpLocationListSearchPopupComponent, CommonModule, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateSalesInvoice2Component
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Sales Invoice2";
  pageErrors: any = [];
  isCreateSalesInvoice2ButtonDisabled = false;
  createSalesInvoice2SectionFields: any = [];
  createSalesInvoice2SectionData: any = {};
  createSalesInvoice2SelectOptionsData: any = {};
  pageComponentReference: any;
  createSalesInvoice2LookupDisplayTextMap: any = {};

  createSalesInvoice2_buyerTypeOptions: DropDownOption[];
  createSalesInvoice2_organisationList: any[];
  selected_createSalesInvoice2_organisationUUID: string;
  createSalesInvoice2_personList: any[];
  selected_createSalesInvoice2_personUUID: string;
  sectionsShowHideInfo = {
    enableCreateSalesInvoice2Section: true,
  };
  yesNoOptions = YES_NO_OPTIONS;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createSalesInvoice2"];
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
    this.createSalesInvoice2_organisationList = [];
    this.selected_createSalesInvoice2_organisationUUID = "";
    this.createSalesInvoice2_personList = [];
    this.selected_createSalesInvoice2_personUUID = "";
    this.createSalesInvoice2_buyerTypeOptions = [
      { id: "Organisation", value: "Organisation" },
      { id: "Individual", value: "Individual" }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createSalesInvoice2",
      this.toastNotificationService,
      this.backendService
    );

    let createSalesInvoice2RequestParamList =
      await this.getApiRequestParameterListCustom(
        "createSalesInvoice2",
        this.backendService,
        this.toastNotificationService
      );
    this.createSalesInvoice2SectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateSalesInvoice2",
        createSalesInvoice2RequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createSalesInvoice2",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createSalesInvoice2",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createSalesInvoice2() {
    this.isCreateSalesInvoice2ButtonDisabled = true;
    this.resetFormErrors("createSalesInvoice2");
    this.pageErrors = [];
    const requestModel: ICreateSalesInvoice2RequestModel = {
      invoiceNo: this.createSalesInvoice2SectionData["invoiceNo"],
      location1UUID: this.createSalesInvoice2SectionData["location1UUID"],
      invoiceDate: this.createSalesInvoice2SectionData["invoiceDate"],
      paymentDate: this.createSalesInvoice2SectionData["paymentDate"],
      paymentTime: this.createSalesInvoice2SectionData["paymentTime"],
      buyerType: this.getComboParameterValue(
        this.createSalesInvoice2SectionData["buyerType"]
      ),
      organisationUUID: this.createSalesInvoice2SectionData["organisationUUID"],
      personUUID: this.createSalesInvoice2SectionData["personUUID"],
      buyerUUID: this.createSalesInvoice2SectionData["buyerUUID"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateSalesInvoice2ButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createSalesInvoice2",
      requestModel,
      this.createSalesInvoice2SectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createSalesInvoice2(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createSalesInvoice2SectionFields = [];
      if (
        !this.doAfterSave(
          "createSalesInvoice2",
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
      this.router.navigate(["/in/retrieve-sales-invoice2"], {
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
          "createSalesInvoice2",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateSalesInvoice2ButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createSalesInvoice2")
      this.createSalesInvoice2LookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createSalesInvoice2") {
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
    let apiFieldList = [...this.createSalesInvoice2SectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createSalesInvoice2SectionFields];
    this.displayAField(key, apiFieldList);
  }

  openSearchPopupInParent(event: any) {
    var fieldKey = event.fieldKey;
    var sectionName = event.sectionName;
    if (sectionName) {
      sectionName = this.toInitLower(sectionName);
    }
    this.openSearchPopup(fieldKey, sectionName);
  }
  openSearchPopup(fieldName: string, sectionName: string) {
    if (1 > 2) {
    } else if (
      fieldName == "location1UUID" &&
      sectionName == "createSalesInvoice2"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "createSalesInvoice2",
        fieldName
      );
    }
  }

  setSearchPopupValue(selectedLookupData: any) {
    let processingSectionName = selectedLookupData["processingSectionName"];
    let processingFieldName = selectedLookupData["processingFieldName"];
    let dataObject: any = {};
    dataObject[processingFieldName] = selectedLookupData["id"];
    this.setSelectedSearchPopupData(
      processingFieldName,
      processingSectionName,
      dataObject,
      selectedLookupData["displayText"]
    );
  }
  setSelectedSearchPopupData(
    processingFieldName: string,
    processingSectionName: any,
    dataObject: any,
    displayText: string
  ) {
    if (1 > 2) {
    } else if (processingSectionName == "createSalesInvoice2") {
      this.createSalesInvoice2SectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createSalesInvoice2LookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-sales-invoice2-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }

  updateSelectOptionsData() {
    this.createSalesInvoice2SelectOptionsData["buyerType"] =
      OptionsList.BuyerType;
  }
}
