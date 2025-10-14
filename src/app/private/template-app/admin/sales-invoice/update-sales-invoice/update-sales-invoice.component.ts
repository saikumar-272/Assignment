import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {
    IRetrieveSalesInvoiceDto
} from "src/app/shared/interfaces/dto/template-app/sales-invoice/retrieve-sales-invoice";
import {
    IUpdateSalesInvoiceRequestModel
} from "src/app/shared/interfaces/dto/template-app/sales-invoice/update-sales-invoice";
import {IResponseMessage, RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {
    retrieveInvoiceLineItemListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/invoice-line-item/retrieve-invoice-line-item-list";
import {
    retrieveCostCenterLineItemListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/cost-center-line-item/retrieve-cost-center-line-item-list";
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
import {getNumberWithCommaSeparated, isBlank,} from "src/app/shared/util/string-util";
import {of} from "rxjs";
@Component({
selector: "app-update-sales-invoice",
  templateUrl: "./update-sales-invoice.component.html",
  styleUrls: ["./update-sales-invoice.component.scss"],
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RetrieveFacultyListSearchPopupComponent, RetrieveEmployeeListSearchPopupComponent, RetrieveEmpLocationListSearchPopupComponent, CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class UpdateSalesInvoiceComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Sales Invoice";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  updateSalesInvoiceSectionFields: any = [];
  updateSalesInvoiceSectionData: any = {};
  updateSalesInvoiceSelectOptionsData: any = {};
  updateSalesInvoiceSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateSalesInvoiceLookupDisplayTextMap: any = {};

  isCreateInvoiceLineItemButtonDisabled = false;
  createInvoiceLineItemLookupDisplayTextMap: any = {};
  createInvoiceLineItemSectionFields: any = [];
  createInvoiceLineItemSectionData: any = {};
  createInvoiceLineItemSelectOptionsData: any = {};
  createInvoiceLineItemSelectedLookupsDataListObj: any = {};

  isUpdateInvoiceLineItemButtonDisabled = false;
  updateInvoiceLineItemLookupDisplayTextMap: any = {};
  updateInvoiceLineItemSectionFields: any = [];
  updateInvoiceLineItemSectionData: any = {};
  updateInvoiceLineItemSelectOptionsData: any = {};
  updateInvoiceLineItemSelectedLookupsDataListObj: any = {};
  retrieveInvoiceLineItemListResultObjectsList: Array<any> = [];

  isCreateCostCenterLineItemButtonDisabled = false;
  createCostCenterLineItemLookupDisplayTextMap: any = {};
  createCostCenterLineItemSectionFields: any = [];
  createCostCenterLineItemSectionData: any = {};
  createCostCenterLineItemSelectOptionsData: any = {};
  createCostCenterLineItemSelectedLookupsDataListObj: any = {};

  isUpdateCostCenterLineItemButtonDisabled = false;
  updateCostCenterLineItemLookupDisplayTextMap: any = {};
  updateCostCenterLineItemSectionFields: any = [];
  updateCostCenterLineItemSectionData: any = {};
  updateCostCenterLineItemSelectOptionsData: any = {};
  updateCostCenterLineItemSelectedLookupsDataListObj: any = {};
  retrieveCostCenterLineItemListResultObjectsList: Array<any> = [];

  yesNoOptions = YES_NO_OPTIONS;
  selectedSalesInvoiceUUID: string = "";
  isUpdateSalesInvoiceButtonDisabled = false;
  processingLineItemRowIndex: number = -1;
  selectedInvoiceLineItemUUID: string = "";
  selectedCostCenterLineItemUUID: string = "";
  netAmount: any = 0;
  retrieveInvoiceLineItemListTableColumns: Array<any> = [];
  retrieveCostCenterLineItemListTableColumns: Array<any> = [];
  sectionsShowHideInfo = {
    enableUpdateSalesInvoiceSection: true,
  };
  lineItemsSectionsShowHideInfo = {
    enableRetrieveInvoiceLineItemListSection: true,
    enableRetrieveCostCenterLineItemListSection: true,
  };
  @ViewChild("retrieveFacultyListSearchPopupCompRef")
  retrieveFacultyListSearchPopupCompRef!: RetrieveFacultyListSearchPopupComponent;
  @ViewChild("retrieveEmployeeListSearchPopupCompRef")
  retrieveEmployeeListSearchPopupCompRef!: RetrieveEmployeeListSearchPopupComponent;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateSalesInvoice"];
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private currentRoute: ActivatedRoute,
    private modalService: NgbModal,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.selectedSalesInvoiceUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateSalesInvoice";
    if (
      this.selectedSalesInvoiceUUID &&
      this.selectedSalesInvoiceUUID.length > 0
    ) {
      this.retrievedDataObject = await this.backendService.retrieveSalesInvoice(
        this.selectedSalesInvoiceUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateSalesInvoice",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
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
      this.setPageTotalAttributesData(this.retrievedDataObject);
      let updateSalesInvoiceRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateSalesInvoice",
          this.backendService,
          this.toastNotificationService
        );
      this.updateSalesInvoiceSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateSalesInvoice",
          updateSalesInvoiceRequestParamList,
          this
        );
      this.modifyData(
        "updateSalesInvoice",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      this.fetchRetrieveInvoiceLineItemList();
      this.fetchRetrieveCostCenterLineItemList();

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

      setTimeout(() => {
        this.updateDisplayPropertyOfApiParameterDependentFields(
          "updateSalesInvoice",
          this.retrievedDataObject,
          this.pageSectionNameList,
          this
        );
      }, 100);
    }
  }
  async fetchRetrieveInvoiceLineItemList() {
    var searchFilter: retrieveInvoiceLineItemListSearchFilter = <
      retrieveInvoiceLineItemListSearchFilter
    >{};
    searchFilter.salesInvoiceUUID = this.selectedSalesInvoiceUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveInvoiceLineItemList(searchFilter)
    );
    this.retrieveInvoiceLineItemListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData(
      "retrieveInvoiceLineItemList",
      this.retrieveInvoiceLineItemListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }
  async fetchRetrieveCostCenterLineItemList() {
    var searchFilter: retrieveCostCenterLineItemListSearchFilter = <
      retrieveCostCenterLineItemListSearchFilter
    >{};
    searchFilter.salesInvoiceUUID = this.selectedSalesInvoiceUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveCostCenterLineItemList(searchFilter)
    );
    this.retrieveCostCenterLineItemListResultObjectsList = searchResponse.list;
    this.retrieveCostCenterLineItemListResultObjectsList =
      this.updateListApiDataWithInjectedFieldsData(
        this.retrieveCostCenterLineItemListResultObjectsList,
        this.toastNotificationService
      );
    this.modifyLineItemsListData(
      "retrieveCostCenterLineItemList",
      this.retrieveCostCenterLineItemListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }

  setPageTotalAttributesData(retrievedObjectInfo: IRetrieveSalesInvoiceDto) {
    this.netAmount = getNumberWithCommaSeparated(retrievedObjectInfo.netAmount);
  }

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
      isCurrentItem: true,
      salesInvoiceUUID: this.selectedSalesInvoiceUUID,
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
    this.retrieveInvoiceLineItemListResultObjectsList.push(request);
    this.doAfterRowAdded(
      this.retrieveInvoiceLineItemListResultObjectsList,
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
    this.modifyData(
      "updateInvoiceLineItem",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
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
      isCurrentItem: true,
      salesInvoiceUUID: this.selectedSalesInvoiceUUID,
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
    this.retrieveCostCenterLineItemListResultObjectsList.push(request);
    this.doAfterRowAdded(
      this.retrieveCostCenterLineItemListResultObjectsList,
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
    this.modifyData(
      "updateCostCenterLineItem",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
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
      invoiceLineItemUUID: this.selectedInvoiceLineItemUUID,
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
    this.retrieveInvoiceLineItemListResultObjectsList[
      this.processingLineItemRowIndex
    ] = request;
    this.doAfterRowAdded(
      this.retrieveInvoiceLineItemListResultObjectsList,
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
  async handleUpdateCostCenterLineItem(modal: any) {
    this.isUpdateCostCenterLineItemButtonDisabled = true;
    let request: any = {
      costCenterLineItemUUID: this.selectedCostCenterLineItemUUID,
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
    this.retrieveCostCenterLineItemListResultObjectsList[
      this.processingLineItemRowIndex
    ] = request;
    this.doAfterRowAdded(
      this.retrieveCostCenterLineItemListResultObjectsList,
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

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.updateSalesInvoiceSectionData = retrievedObjectInfo;
      this.updateSalesInvoiceLookupDisplayTextMap = {};
      this.updateSalesInvoiceLookupDisplayTextMap["location1UUID"] = isBlank(
        retrievedObjectInfo["location1DisplayText"]
      )
        ? ""
        : retrievedObjectInfo["location1DisplayText"];
      document
        .getElementById("update-sales-invoice-form")
        ?.querySelector("#location1UUID")
        ?.setAttribute(
          "value",
          this.updateSalesInvoiceLookupDisplayTextMap["location1UUID"]
        );
      this.doAfterPageDataLoaded(
        "updateSalesInvoice",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateSalesInvoice", this, retrievedObjectInfo);
    }, 100);
  }
  async updateSalesInvoice() {
    this.isUpdateSalesInvoiceButtonDisabled = true;
    this.resetFormErrors("updateSalesInvoice");
    this.pageErrors = [];
    const requestModel: IUpdateSalesInvoiceRequestModel = {
      salesInvoiceUUID: this.selectedSalesInvoiceUUID,
      invoiceNo: this.updateSalesInvoiceSectionData["invoiceNo"],
      location1UUID: this.updateSalesInvoiceSectionData["location1UUID"],
      invoiceDate: this.updateSalesInvoiceSectionData["invoiceDate"],
      isPassed: this.getBooleanParameterValue(
        this.updateSalesInvoiceSectionData["isPassed"]
      ),
      passMarks: this.updateSalesInvoiceSectionData["passMarks"],
      failMarks: this.updateSalesInvoiceSectionData["failMarks"],
      invoiceLineItemList: [],
      costCenterLineItemList: [],
    };
    requestModel.invoiceLineItemList =
      this.retrieveInvoiceLineItemListResultObjectsList;
    requestModel.costCenterLineItemList =
      this.retrieveCostCenterLineItemListResultObjectsList;
    this.getUpdatedPayload(
      "updateSalesInvoice",
      requestModel,
      this.updateSalesInvoiceSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateSalesInvoiceButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateSalesInvoice(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateSalesInvoice",
          requestModel,
          entityUpdateResponse,
          this,
          this.router,
          this.currentRoute,
          this.backendService,
          this.toastNotificationService
        )
      ) {
        return;
      }
      window.location.reload();
    } else {
      if (
        entityUpdateResponse.errors &&
        entityUpdateResponse.errors.length > 0
      ) {
        if (
          entityUpdateResponse.alert &&
          entityUpdateResponse.alert.length > 0
        ) {
          toastErrorMessage = entityUpdateResponse.alert;
        }
        this.toastNotificationService.showError(toastErrorMessage);
        this.pageErrors = this.getPageErrors(entityUpdateResponse.errors);
        this.populateFieldLevelErrors(
          "updateSalesInvoice",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateSalesInvoiceButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateSalesInvoice")
      this.updateSalesInvoiceLookupDisplayTextMap[fieldKey] = selectedValue;
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
    if (field.apiName === "updateSalesInvoice") {
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
    let apiFieldList = [...this.updateSalesInvoiceSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateSalesInvoiceSectionFields];
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
      sectionName == "updateSalesInvoice"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "updateSalesInvoice",
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
    } else if (processingSectionName == "updateSalesInvoice") {
      this.updateSalesInvoiceSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateSalesInvoiceLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-sales-invoice-form")
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
  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

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

  updateSelectOptionsData() {
    this.createInvoiceLineItemSelectOptionsData["gender"] = OptionsList.Gender;
    this.updateInvoiceLineItemSelectOptionsData["gender"] = OptionsList.Gender;
  }
}
