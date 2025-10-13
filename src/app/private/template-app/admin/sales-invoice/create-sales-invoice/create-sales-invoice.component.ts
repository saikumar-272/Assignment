import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
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
    ICreateSalesInvoiceRequestModel
} from "src/app/shared/interfaces/dto/template-app/sales-invoice/create-sales-invoice";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {
    RetrieveFacultyListSearchPopupComponent
} from "src/app/private/admin/searchpopups/faculty/retrieve-faculty-list/retrieve-faculty-list-search-popup.component";
import {
    RetrieveEmployeeListSearchPopupComponent
} from "src/app/private/admin/searchpopups/employee/retrieve-employee-list/retrieve-employee-list-search-popup.component";
import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import {isBlank} from "src/app/shared/util/string-util";
import {of} from "rxjs";
@Component({
selector: "app-create-sales-invoice",
  templateUrl: "./create-sales-invoice.component.html",
  styleUrls: ["./create-sales-invoice.component.scss"],
  imports: [ AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RetrieveFacultyListSearchPopupComponent, RetrieveEmployeeListSearchPopupComponent, RetrieveEmpLocationListSearchPopupComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class CreateSalesInvoiceComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Sales Invoice";
  pageErrors: any = [];
  createSalesInvoiceSectionFields: any = [];
  createSalesInvoiceSectionData: any = {};
  createSalesInvoiceSelectOptionsData: any = {};
  pageComponentReference: any;
  createSalesInvoiceLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateSalesInvoiceSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;
  isCreateSalesInvoiceButtonDisabled = false;
  processingLineItemRowIndex: number = -1;
  netAmount: number = 0;
  isCreateInvoiceLineItemButtonDisabled = false;
  createInvoiceLineItemLookupDisplayTextMap: any = {};

  createInvoiceLineItemSectionFields: any = [];
  createInvoiceLineItemSectionData: any = {};
  createInvoiceLineItemSelectOptionsData: any = {};

  isUpdateInvoiceLineItemButtonDisabled = false;
  updateInvoiceLineItemSectionFields: any = [];
  updateInvoiceLineItemSectionData: any = {};
  updateInvoiceLineItemSelectOptionsData: any = {};
  updateInvoiceLineItemSelectedLookupsDataListObj: any = {};
  updateInvoiceLineItemLookupDisplayTextMap: any = {};
  invoiceLineItemDataList: Array<any> = [];
  retrieveInvoiceLineItemListTableColumns: Array<any> = [];
  isCreateCostCenterLineItemButtonDisabled = false;
  createCostCenterLineItemLookupDisplayTextMap: any = {};

  createCostCenterLineItemSectionFields: any = [];
  createCostCenterLineItemSectionData: any = {};
  createCostCenterLineItemSelectOptionsData: any = {};

  isUpdateCostCenterLineItemButtonDisabled = false;
  updateCostCenterLineItemSectionFields: any = [];
  updateCostCenterLineItemSectionData: any = {};
  updateCostCenterLineItemSelectOptionsData: any = {};
  updateCostCenterLineItemSelectedLookupsDataListObj: any = {};
  updateCostCenterLineItemLookupDisplayTextMap: any = {};
  costCenterLineItemDataList: Array<any> = [];
  retrieveCostCenterLineItemListTableColumns: Array<any> = [];
  @ViewChild("retrieveFacultyListSearchPopupCompRef")
  retrieveFacultyListSearchPopupCompRef!: RetrieveFacultyListSearchPopupComponent;
  @ViewChild("retrieveEmployeeListSearchPopupCompRef")
  retrieveEmployeeListSearchPopupCompRef!: RetrieveEmployeeListSearchPopupComponent;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createSalesInvoice"];
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
      "createSalesInvoice",
      this.toastNotificationService,
      this.backendService
    );
    let retrievedObjectInfo = {};
    let retrieveInvoiceLineItemListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveInvoiceLineItemList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveInvoiceLineItemListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveInvoiceLineItemList",
        retrieveInvoiceLineItemListResponseParamList,
        this
      );
    let retrieveCostCenterLineItemListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveCostCenterLineItemList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveCostCenterLineItemListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveCostCenterLineItemList",
        retrieveCostCenterLineItemListResponseParamList,
        this
      );
    let createInvoiceLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createInvoiceLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.createInvoiceLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createInvoiceLineItem",
        createInvoiceLineItemRequestParamList,
        this
      );

    let updateInvoiceLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateInvoiceLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.updateInvoiceLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateInvoiceLineItem",
        updateInvoiceLineItemRequestParamList,
        this
      );
    let createCostCenterLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createCostCenterLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.createCostCenterLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createCostCenterLineItem",
        createCostCenterLineItemRequestParamList,
        this
      );

    let updateCostCenterLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateCostCenterLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.updateCostCenterLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateCostCenterLineItem",
        updateCostCenterLineItemRequestParamList,
        this
      );

    let createSalesInvoiceRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createSalesInvoice",
        this.backendService,
        this.toastNotificationService
      );
    this.createSalesInvoiceSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateSalesInvoice",
        createSalesInvoiceRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createSalesInvoice",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createSalesInvoice",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createSalesInvoice() {
    this.isCreateSalesInvoiceButtonDisabled = true;
    this.resetFormErrors("createSalesInvoice");
    this.pageErrors = [];
    const requestModel: ICreateSalesInvoiceRequestModel = {
      invoiceNo: this.createSalesInvoiceSectionData["invoiceNo"],
      location1UUID: this.createSalesInvoiceSectionData["location1UUID"],
      invoiceDate: this.createSalesInvoiceSectionData["invoiceDate"],
      isPassed: this.getBooleanParameterValue(
        this.createSalesInvoiceSectionData["isPassed"]
      ),
      passMarks: this.createSalesInvoiceSectionData["passMarks"],
      failMarks: this.createSalesInvoiceSectionData["failMarks"],
      invoiceLineItemList: [],
      costCenterLineItemList: [],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateSalesInvoiceButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    requestModel.invoiceLineItemList = this.invoiceLineItemDataList;
    requestModel.costCenterLineItemList = this.costCenterLineItemDataList;
    this.getUpdatedPayload(
      "createSalesInvoice",
      requestModel,
      this.createSalesInvoiceSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createSalesInvoice(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createSalesInvoiceSectionFields = [];
      if (
        !this.doAfterSave(
          "createSalesInvoice",
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
      this.router.navigate(["/in/update-sales-invoice"], {
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
          "createSalesInvoice",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateSalesInvoiceButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createSalesInvoice")
      this.createSalesInvoiceLookupDisplayTextMap[fieldKey] = selectedValue;
    else if (this.toInitLower(fieldApiName) === "createInvoiceLineItem")
      this.createInvoiceLineItemLookupDisplayTextMap[fieldKey] = selectedValue;
    else if (this.toInitLower(fieldApiName) === "updateInvoiceLineItem")
      this.updateInvoiceLineItemLookupDisplayTextMap[fieldKey] = selectedValue;
    else if (this.toInitLower(fieldApiName) === "createCostCenterLineItem")
      this.createCostCenterLineItemLookupDisplayTextMap[fieldKey] =
        selectedValue;
    else if (this.toInitLower(fieldApiName) === "updateCostCenterLineItem")
      this.updateCostCenterLineItemLookupDisplayTextMap[fieldKey] =
        selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createSalesInvoice") {
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        this.pageSectionNameList
      );
    }
    if (field.apiName === "createInvoiceLineItem")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["createInvoiceLineItem"]
      );
    if (field.apiName === "updateInvoiceLineItem")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["updateInvoiceLineItem"]
      );
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
    let apiFieldList = [...this.createSalesInvoiceSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createSalesInvoiceSectionFields];
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
      sectionName == "createSalesInvoice"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "createSalesInvoice",
        fieldName
      );
    } else if (
      fieldName == "faculty1UUID" &&
      sectionName == "createInvoiceLineItem"
    ) {
      this.retrieveFacultyListSearchPopupCompRef.showRetrieveFacultyListSearchPopup(
        "createInvoiceLineItem",
        fieldName
      );
    } else if (
      fieldName == "faculty1UUID" &&
      sectionName == "updateInvoiceLineItem"
    ) {
      this.retrieveFacultyListSearchPopupCompRef.showRetrieveFacultyListSearchPopup(
        "updateInvoiceLineItem",
        fieldName
      );
    } else if (
      fieldName == "employee1UUID" &&
      sectionName == "createCostCenterLineItem"
    ) {
      this.retrieveEmployeeListSearchPopupCompRef.showRetrieveEmployeeListSearchPopup(
        "createCostCenterLineItem",
        fieldName
      );
    } else if (
      fieldName == "employee1UUID" &&
      sectionName == "updateCostCenterLineItem"
    ) {
      this.retrieveEmployeeListSearchPopupCompRef.showRetrieveEmployeeListSearchPopup(
        "updateCostCenterLineItem",
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
    } else if (processingSectionName == "createSalesInvoice") {
      this.createSalesInvoiceSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createSalesInvoiceLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-sales-invoice-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "createInvoiceLineItem") {
      this.createInvoiceLineItemSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createInvoiceLineItemLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-invoice-line-item-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateInvoiceLineItem") {
      this.updateInvoiceLineItemSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateInvoiceLineItemLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-invoice-line-item-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "createCostCenterLineItem") {
      this.createCostCenterLineItemSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createCostCenterLineItemLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-cost-center-line-item-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateCostCenterLineItem") {
      this.updateCostCenterLineItemSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateCostCenterLineItemLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-cost-center-line-item-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }

  //Start consolidated update line items code block
  async toggleCreateInvoiceLineItemPopup(modal: any) {
    this.createInvoiceLineItemSectionFields = [];
    this.createInvoiceLineItemSectionData = {};
    this.createInvoiceLineItemLookupDisplayTextMap = {};
    let createInvoiceLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createInvoiceLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.createInvoiceLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createInvoiceLineItem",
        createInvoiceLineItemRequestParamList,
        this
      );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-invoice-line-item-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createInvoiceLineItemSectionFields = [];
        },
        (reason) => {
          this.createInvoiceLineItemSectionFields = [];
        }
      );
  }
  async toggleCreateCostCenterLineItemPopup(modal: any) {
    this.createCostCenterLineItemSectionFields = [];
    this.createCostCenterLineItemSectionData = {};
    this.createCostCenterLineItemLookupDisplayTextMap = {};
    let createCostCenterLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createCostCenterLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.createCostCenterLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createCostCenterLineItem",
        createCostCenterLineItemRequestParamList,
        this
      );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-cost-center-line-item-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createCostCenterLineItemSectionFields = [];
        },
        (reason) => {
          this.createCostCenterLineItemSectionFields = [];
        }
      );
  }
  async handleCreateInvoiceLineItem(modal: any) {
    this.isCreateInvoiceLineItemButtonDisabled = true;
    let request: any = {
      productName: this.createInvoiceLineItemSectionData["productName"],
      lastName: this.createInvoiceLineItemSectionData["lastName"],
      gender: this.getComboParameterValue(
        this.createInvoiceLineItemSectionData["gender"]
      ),
      faculty1UUID: this.createInvoiceLineItemSectionData["faculty1UUID"],
      faculty1DisplayText:
        this.createInvoiceLineItemLookupDisplayTextMap["faculty1UUID"],
      isAccountActive: this.getBooleanParameterValue(
        this.createInvoiceLineItemSectionData["isAccountActive"]
      ),
      dateOfBirth: this.createInvoiceLineItemSectionData["dateOfBirth"],
      dynamicLocationUUID:
        this.createInvoiceLineItemSectionData["dynamicLocationUUID"],
      dynamicLocationDisplayText:
        this.createInvoiceLineItemLookupDisplayTextMap["dynamicLocationUUID"],
      staticLocationUUID:
        this.createInvoiceLineItemSectionData["staticLocationUUID"],
      staticLocationDisplayText:
        this.createInvoiceLineItemLookupDisplayTextMap["staticLocationUUID"],
      age: this.createInvoiceLineItemSectionData["age"],
      percentage: this.createInvoiceLineItemSectionData["percentage"],
      collegeId: this.createInvoiceLineItemSectionData["collegeId"],
      dateTimeField: this.createInvoiceLineItemSectionData["dateTimeField"],
      dateTimeWithSecondsField:
        this.createInvoiceLineItemSectionData["dateTimeWithSecondsField"],
      timeField: this.createInvoiceLineItemSectionData["timeField"],
      timeWithSecondsField:
        this.createInvoiceLineItemSectionData["timeWithSecondsField"],
      isPassed: this.getBooleanParameterValue(
        this.createInvoiceLineItemSectionData["isPassed"]
      ),
      passMarks: this.createInvoiceLineItemSectionData["passMarks"],
      failMarks: this.createInvoiceLineItemSectionData["failMarks"],
      salesInvoiceUUID: "",
      isCurrentItem: true,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateInvoiceLineItemButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.invoiceLineItemDataList.push(request);
    this.doAfterRowAdded(
      this.invoiceLineItemDataList,
      "CreateInvoiceLineItem",
      this.backendService,
      this.toastNotificationService,
      this,
      this.createInvoiceLineItemSectionData,
      request,
      this.additionalProperties
    );
    modal.close();
    this.isCreateInvoiceLineItemButtonDisabled = false;
  }
  async toggleUpdateInvoiceLineItemPopup(
    modal: any,
    rowDataObject: any,
    lineItemRowIndex: number
  ) {
    this.updateInvoiceLineItemSectionFields = [];
    this.updateInvoiceLineItemLookupDisplayTextMap = {};
    this.updateInvoiceLineItemLookupDisplayTextMap["faculty1UUID"] = isBlank(
      rowDataObject["faculty1DisplayText"]
    )
      ? ""
      : rowDataObject["faculty1DisplayText"];
    this.updateInvoiceLineItemLookupDisplayTextMap["dynamicLocationUUID"] =
      isBlank(rowDataObject["dynamicLocationDisplayText"])
        ? ""
        : rowDataObject["dynamicLocationDisplayText"];
    this.updateInvoiceLineItemLookupDisplayTextMap["staticLocationUUID"] =
      isBlank(rowDataObject["staticLocationDisplayText"])
        ? ""
        : rowDataObject["staticLocationDisplayText"];
    this.processingLineItemRowIndex = lineItemRowIndex;
    this.modifyData(
      "updateInvoiceLineItem",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateInvoiceLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateInvoiceLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.updateInvoiceLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateInvoiceLineItem",
        updateInvoiceLineItemRequestParamList,
        this
      );
    this.setUpdateInvoiceLineItemSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToInvoiceLineItemPopup(rowDataObject);
    this.updateDisplayPropertyOfApiParameterDependentFields(
      "updateInvoiceLineItem",
      rowDataObject,
      ["updateInvoiceLineItem"],
      this
    );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-invoice-line-item-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateInvoiceLineItemSectionFields = [];
        },
        (reason) => {
          this.updateInvoiceLineItemSectionFields = [];
        }
      );
  }
  setValuesToInvoiceLineItemPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateInvoiceLineItemSectionData = { ...retrievedObjectInfo };
      document
        .getElementById("update-invoice-line-item-modal-body")
        ?.querySelector("#faculty1UUID")
        ?.setAttribute(
          "value",
          this.updateInvoiceLineItemLookupDisplayTextMap["faculty1UUID"]
        );
    }, 100);
  }

  async handleCreateCostCenterLineItem(modal: any) {
    this.isCreateCostCenterLineItemButtonDisabled = true;
    let request: any = {
      costCenterName:
        this.createCostCenterLineItemSectionData["costCenterName"],
      employee1UUID: this.createCostCenterLineItemSectionData["employee1UUID"],
      employee1DisplayText:
        this.createCostCenterLineItemLookupDisplayTextMap["employee1UUID"],
      description: this.createCostCenterLineItemSectionData["description"],
      salesInvoiceUUID: "",
      isCurrentItem: true,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateCostCenterLineItemButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    let injectedFieldsDataJsonText: string = "{}";
    injectedFieldsDataJsonText = this.getUpdatedInjectedFieldsDataJsonText(
      injectedFieldsDataJsonText,
      this.createCostCenterLineItemSectionFields,
      this.createCostCenterLineItemSectionData
    );
    request.injectedFieldsDataJsonText = injectedFieldsDataJsonText;
    request = this.updatePayloadWithInjectedLookupFieldDisplayText(
      request,
      this.createCostCenterLineItemSectionFields,
      this.createCostCenterLineItemLookupDisplayTextMap
    );
    this.costCenterLineItemDataList.push(request);
    this.doAfterRowAdded(
      this.costCenterLineItemDataList,
      "CreateCostCenterLineItem",
      this.backendService,
      this.toastNotificationService,
      this,
      this.createCostCenterLineItemSectionData,
      request,
      this.additionalProperties
    );
    modal.close();
    this.isCreateCostCenterLineItemButtonDisabled = false;
  }
  async toggleUpdateCostCenterLineItemPopup(
    modal: any,
    rowDataObject: any,
    lineItemRowIndex: number
  ) {
    this.updateCostCenterLineItemSectionFields = [];
    this.updateCostCenterLineItemLookupDisplayTextMap = {};
    this.updateCostCenterLineItemLookupDisplayTextMap["employee1UUID"] =
      isBlank(rowDataObject["employee1DisplayText"])
        ? ""
        : rowDataObject["employee1DisplayText"];
    this.updateCostCenterLineItemLookupDisplayTextMap =
      this.updateLookupDisplayTextMapWithInjectedFieldsDisplayText(
        rowDataObject,
        this.updateCostCenterLineItemLookupDisplayTextMap,
        this.toastNotificationService
      );
    this.processingLineItemRowIndex = lineItemRowIndex;
    rowDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(
      rowDataObject,
      this.toastNotificationService
    );
    this.modifyData(
      "updateCostCenterLineItem",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateCostCenterLineItemRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateCostCenterLineItem",
        this.backendService,
        this.toastNotificationService
      );
    this.updateCostCenterLineItemSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateCostCenterLineItem",
        updateCostCenterLineItemRequestParamList,
        this
      );
    this.setUpdateCostCenterLineItemSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToCostCenterLineItemPopup(rowDataObject);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-cost-center-line-item-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateCostCenterLineItemSectionFields = [];
        },
        (reason) => {
          this.updateCostCenterLineItemSectionFields = [];
        }
      );
  }
  setValuesToCostCenterLineItemPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateCostCenterLineItemSectionData = { ...retrievedObjectInfo };
      document
        .getElementById("update-cost-center-line-item-modal-body")
        ?.querySelector("#employee1UUID")
        ?.setAttribute(
          "value",
          this.updateCostCenterLineItemLookupDisplayTextMap["employee1UUID"]
        );
    }, 100);
  }

  async handleUpdateInvoiceLineItem(modal: any) {
    this.isUpdateInvoiceLineItemButtonDisabled = true;
    let request: any = {
      invoiceLineItemUUID: "",
      productName: this.updateInvoiceLineItemSectionData["productName"],
      lastName: this.updateInvoiceLineItemSectionData["lastName"],
      gender: this.getComboParameterValue(
        this.updateInvoiceLineItemSectionData["gender"]
      ),
      faculty1UUID: this.updateInvoiceLineItemSectionData["faculty1UUID"],
      faculty1DisplayText:
        this.updateInvoiceLineItemLookupDisplayTextMap["faculty1UUID"],
      isAccountActive: this.getBooleanParameterValue(
        this.updateInvoiceLineItemSectionData["isAccountActive"]
      ),
      dateOfBirth: this.updateInvoiceLineItemSectionData["dateOfBirth"],
      dynamicLocationUUID:
        this.updateInvoiceLineItemSectionData["dynamicLocationUUID"],
      dynamicLocationDisplayText:
        this.updateInvoiceLineItemLookupDisplayTextMap["dynamicLocationUUID"],
      staticLocationUUID:
        this.updateInvoiceLineItemSectionData["staticLocationUUID"],
      staticLocationDisplayText:
        this.updateInvoiceLineItemLookupDisplayTextMap["staticLocationUUID"],
      age: this.updateInvoiceLineItemSectionData["age"],
      percentage: this.updateInvoiceLineItemSectionData["percentage"],
      collegeId: this.updateInvoiceLineItemSectionData["collegeId"],
      dateTimeField: this.updateInvoiceLineItemSectionData["dateTimeField"],
      dateTimeWithSecondsField:
        this.updateInvoiceLineItemSectionData["dateTimeWithSecondsField"],
      timeField: this.updateInvoiceLineItemSectionData["timeField"],
      timeWithSecondsField:
        this.updateInvoiceLineItemSectionData["timeWithSecondsField"],
      isPassed: this.getBooleanParameterValue(
        this.updateInvoiceLineItemSectionData["isPassed"]
      ),
      passMarks: this.updateInvoiceLineItemSectionData["passMarks"],
      failMarks: this.updateInvoiceLineItemSectionData["failMarks"],
      isCurrentItem: true,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateInvoiceLineItemButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.invoiceLineItemDataList[this.processingLineItemRowIndex] = request;
    this.doAfterRowAdded(
      this.invoiceLineItemDataList,
      "UpdateInvoiceLineItem",
      this.backendService,
      this.toastNotificationService,
      this,
      this.updateInvoiceLineItemSectionData,
      request,
      this.additionalProperties
    );
    modal.close();
    this.isUpdateInvoiceLineItemButtonDisabled = false;
  }
  setUpdateInvoiceLineItemSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["faculty1UUID"])) {
      this.updateInvoiceLineItemSelectedLookupsDataListObj["faculty1UUID"] = of(
        [
          {
            id: retrievedObjectInfo["faculty1UUID"],
            value: retrievedObjectInfo["faculty1DisplayText"],
          }]
      );
    }
    if (!isBlank(retrievedObjectInfo["dynamicLocationUUID"])) {
      this.updateInvoiceLineItemSelectedLookupsDataListObj[
        "dynamicLocationUUID"
      ] = of([
        {
          id: retrievedObjectInfo["dynamicLocationUUID"],
          value: retrievedObjectInfo["dynamicLocationDisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["staticLocationUUID"])) {
      this.updateInvoiceLineItemSelectedLookupsDataListObj[
        "staticLocationUUID"
      ] = of([
        {
          id: retrievedObjectInfo["staticLocationUUID"],
          value: retrievedObjectInfo["staticLocationDisplayText"],
        }]);
    }
  }
  async handleUpdateCostCenterLineItem(modal: any) {
    this.isUpdateCostCenterLineItemButtonDisabled = true;
    let request: any = {
      costCenterLineItemUUID: "",
      costCenterName:
        this.updateCostCenterLineItemSectionData["costCenterName"],
      employee1UUID: this.updateCostCenterLineItemSectionData["employee1UUID"],
      employee1DisplayText:
        this.updateCostCenterLineItemLookupDisplayTextMap["employee1UUID"],
      description: this.updateCostCenterLineItemSectionData["description"],
      isCurrentItem: true,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateCostCenterLineItemButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    let injectedFieldsDataJsonText: string = "{}";
    injectedFieldsDataJsonText = this.getUpdatedInjectedFieldsDataJsonText(
      injectedFieldsDataJsonText,
      this.updateCostCenterLineItemSectionFields,
      this.updateCostCenterLineItemSectionData
    );
    request.injectedFieldsDataJsonText = injectedFieldsDataJsonText;
    request = this.updatePayloadWithInjectedLookupFieldDisplayText(
      request,
      this.updateCostCenterLineItemSectionFields,
      this.updateCostCenterLineItemLookupDisplayTextMap
    );
    this.costCenterLineItemDataList[this.processingLineItemRowIndex] = request;
    this.doAfterRowAdded(
      this.costCenterLineItemDataList,
      "UpdateCostCenterLineItem",
      this.backendService,
      this.toastNotificationService,
      this,
      this.updateCostCenterLineItemSectionData,
      request,
      this.additionalProperties
    );
    modal.close();
    this.isUpdateCostCenterLineItemButtonDisabled = false;
  }
  setUpdateCostCenterLineItemSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {
    if (!isBlank(retrievedObjectInfo["employee1UUID"])) {
      this.updateCostCenterLineItemSelectedLookupsDataListObj["employee1UUID"] =
        of([
          {
            id: retrievedObjectInfo["employee1UUID"],
            value: retrievedObjectInfo["employee1DisplayText"],
          }]);
    }
    this.updateInjectedFieldsSelectedLookupData(
      this.updateCostCenterLineItemSelectedLookupsDataListObj,
      retrievedObjectInfo
    );
  }
  //End consolidated update line items code block

  updateSelectOptionsData() {
    this.createInvoiceLineItemSelectOptionsData["gender"] = OptionsList.Gender;
    this.updateInvoiceLineItemSelectOptionsData["gender"] = OptionsList.Gender;
  }
}
