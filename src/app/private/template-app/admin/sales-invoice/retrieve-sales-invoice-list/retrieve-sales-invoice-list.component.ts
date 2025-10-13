import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";

import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
    retrieveSalesInvoiceListDataObject,
    retrieveSalesInvoiceListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/sales-invoice/retrieve-sales-invoice-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";

import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-sales-invoice-list",
  templateUrl: "./retrieve-sales-invoice-list.component.html",
  styleUrls: ["./retrieve-sales-invoice-list.component.scss"],
  imports: [AdminChildSectionFormComponent, BrowserAnimationsModule, DynamicFieldDisplayComponent, NgbModule, RetrieveEmpLocationListSearchPopupComponent, CommonModule, RouterModule, NgbPaginationModule],
  standalone: true
})
export class RetrieveSalesInvoiceListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveSalesInvoiceListSectionFields: any = [];
  retrieveSalesInvoiceListSectionData: any = {};
  retrieveSalesInvoiceListSelectOptionsData: any = {};

  selectedSalesInvoiceUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveSalesInvoiceListSearchFilter = <
    retrieveSalesInvoiceListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveSalesInvoiceListDataObject[]> = new Map<
    number,
    retrieveSalesInvoiceListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveSalesInvoiceListTableColumns: Array<any> = [];
  isPaginationInitialized = false;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;

  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private route: Router,
    private currentRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    super();
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveSalesInvoiceList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveSalesInvoiceListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveSalesInvoiceList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSalesInvoiceListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveSalesInvoiceList",
        retrieveSalesInvoiceListResponseParamList,
        this
      );
    //Load page fields
    let retrieveSalesInvoiceListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveSalesInvoiceList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSalesInvoiceListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveSalesInvoiceList",
        retrieveSalesInvoiceListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveSalesInvoiceList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveSalesInvoiceList", this.currentRoute, this, [
      "retrieveSalesInvoiceListSC",
    ]);
  }

  async resetSearchCriteria() {
    this.retrieveSalesInvoiceListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchSalesInvoiceList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.invoiceNo =
      this.retrieveSalesInvoiceListSectionData["invoiceNo"];
    this.searchFilter.location1UUID =
      this.retrieveSalesInvoiceListSectionData["location1UUID"];
    this.searchFilter.invoiceDate =
      this.retrieveSalesInvoiceListSectionData["invoiceDate"];
    this.searchFilter.isPassed =
      this.retrieveSalesInvoiceListSectionData["isPassed"];
    this.searchFilter.passMarks =
      this.retrieveSalesInvoiceListSectionData["passMarks"];
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      this.searchFilter
    );
    if (numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return false;
    }
    return true;
  }

  async handleSalesInvoiceListPageChange(): Promise<void> {
    // Skip the first auto-triggered page change on load
    if (!this.isPaginationInitialized) {
      this.isPaginationInitialized = true;
      return;
    }
    if (!this.populateSearchFilterFromForm()) {
      this.searchResultObjectsList = [];
      this.pageResultsMap.clear();
      return;
    }
    this.fetchSalesInvoiceList();
  }

  async fetchSalesInvoiceList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveSalesInvoiceList(this.searchFilter)
    );
    if (searchResponse.success == 0) {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }
    if (searchResponse.alert) {
      this.toastNotificationService.showSuccess(searchResponse.alert);
    } else {
      this.searchResultObjectsList = searchResponse.list;
      this.collectionSize = searchResponse.matchingSearchResultsCount;
      this.noOfPages = searchResponse.totalPages;
      this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
    }
  }

  executeUserAction(actionName: any, dataObject: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveSalesInvoiceList",
      this.router,
      dataObject,
      this.backendService,
      this.toastNotificationService
    );
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
      sectionName == "retrieveSalesInvoiceList"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "retrieveSalesInvoiceList",
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
    } else if (processingSectionName == "retrieveSalesInvoiceList") {
      this.retrieveSalesInvoiceListSectionData[processingFieldName] =
        dataObject[processingFieldName];
      document
        .getElementById("retrieve-sales-invoice-list-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "retrieveSalesInvoiceList")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["retrieveSalesInvoiceList"]
      );
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveSalesInvoiceListSC",
    ]);
  }

  updateSelectOptionsData() {}
}
