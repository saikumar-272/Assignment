import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";

import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
    retrieveSalesInvoice2ListDataObject,
    retrieveSalesInvoice2ListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/sales-invoice2/retrieve-sales-invoice2-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-sales-invoice2-list",
  templateUrl: "./retrieve-sales-invoice2-list.component.html",
  styleUrls: ["./retrieve-sales-invoice2-list.component.scss"],
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, CommonModule, RouterModule, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveSalesInvoice2ListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveSalesInvoice2ListSectionFields: any = [];
  retrieveSalesInvoice2ListSectionData: any = {};
  retrieveSalesInvoice2ListSelectOptionsData: any = {};

  selectedSalesInvoice2UUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveSalesInvoice2ListSearchFilter = <
    retrieveSalesInvoice2ListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveSalesInvoice2ListDataObject[]> = new Map<
    number,
    retrieveSalesInvoice2ListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  retrieveSalesInvoice2List_organisationList: any[];
  selected_retrieveSalesInvoice2List_organisationUUID: string;
  retrieveSalesInvoice2List_personList: any[];
  selected_retrieveSalesInvoice2List_personUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveSalesInvoice2ListTableColumns: Array<any> = [];
  isPaginationInitialized = false;

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
    this.retrieveSalesInvoice2List_organisationList = [];
    this.selected_retrieveSalesInvoice2List_organisationUUID = "";
    this.retrieveSalesInvoice2List_personList = [];
    this.selected_retrieveSalesInvoice2List_personUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveSalesInvoice2List");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveSalesInvoice2ListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveSalesInvoice2List",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSalesInvoice2ListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveSalesInvoice2List",
        retrieveSalesInvoice2ListResponseParamList,
        this
      );
    //Load page fields
    let retrieveSalesInvoice2ListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveSalesInvoice2List",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSalesInvoice2ListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveSalesInvoice2List",
        retrieveSalesInvoice2ListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveSalesInvoice2List",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveSalesInvoice2List", this.currentRoute, this, [
      "retrieveSalesInvoice2ListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveSalesInvoice2ListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchSalesInvoice2List();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.invoiceNo =
      this.retrieveSalesInvoice2ListSectionData["invoiceNo"];
    this.searchFilter.invoiceDate =
      this.retrieveSalesInvoice2ListSectionData["invoiceDate"];
    this.searchFilter.paymentDate =
      this.retrieveSalesInvoice2ListSectionData["paymentDate"];
    this.searchFilter.paymentTime =
      this.retrieveSalesInvoice2ListSectionData["paymentTime"];
    this.searchFilter.buyerType =
      this.retrieveSalesInvoice2ListSectionData["buyerType"];
    this.searchFilter.organisationUUID =
      this.retrieveSalesInvoice2ListSectionData["organisationUUID"];
    this.searchFilter.personUUID =
      this.retrieveSalesInvoice2ListSectionData["personUUID"];
    this.searchFilter.buyerUUID =
      this.retrieveSalesInvoice2ListSectionData["buyerUUID"];
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

  async handleSalesInvoice2ListPageChange(): Promise<void> {
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
    this.fetchSalesInvoice2List();
  }

  async fetchSalesInvoice2List() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveSalesInvoice2List(this.searchFilter)
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
      "RetrieveSalesInvoice2List",
      this.router,
      dataObject,
      this.backendService,
      this.toastNotificationService
    );
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "retrieveSalesInvoice2List")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["retrieveSalesInvoice2List"]
      );
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveSalesInvoice2ListSC"]);
  }

  updateSelectOptionsData() {
    this.retrieveSalesInvoice2ListSelectOptionsData["buyerType"] =
      OptionsList.BuyerType;
  }
}
