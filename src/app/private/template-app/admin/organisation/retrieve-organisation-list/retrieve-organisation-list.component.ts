import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";

import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
    retrieveOrganisationListDataObject,
    retrieveOrganisationListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/organisation/retrieve-organisation-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-organisation-list",
  templateUrl: "./retrieve-organisation-list.component.html",
  styleUrls: ["./retrieve-organisation-list.component.scss"],
  imports: [AdminChildSectionFormComponent,  DynamicFieldDisplayComponent, NgbModule, CommonModule, RouterModule, NgbPaginationModule],
  standalone: true
})
export class RetrieveOrganisationListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveOrganisationListSectionFields: any = [];
  retrieveOrganisationListSectionData: any = {};
  retrieveOrganisationListSelectOptionsData: any = {};

  selectedOrganisationUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveOrganisationListSearchFilter = <
    retrieveOrganisationListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveOrganisationListDataObject[]> = new Map<
    number,
    retrieveOrganisationListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveOrganisationListTableColumns: Array<any> = [];
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
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveOrganisationList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveOrganisationListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveOrganisationList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveOrganisationListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveOrganisationList",
        retrieveOrganisationListResponseParamList,
        this
      );
    //Load page fields
    let retrieveOrganisationListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveOrganisationList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveOrganisationListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveOrganisationList",
        retrieveOrganisationListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveOrganisationList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveOrganisationList", this.currentRoute, this, [
      "retrieveOrganisationListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveOrganisationListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchOrganisationList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.name = this.retrieveOrganisationListSectionData["name"];
    this.searchFilter.emailId =
      this.retrieveOrganisationListSectionData["emailId"];
    this.searchFilter.contactNo =
      this.retrieveOrganisationListSectionData["contactNo"];
    this.searchFilter.isCommissionAgent =
      this.retrieveOrganisationListSectionData["isCommissionAgent"];
    this.searchFilter.commissionAgentName =
      this.retrieveOrganisationListSectionData["commissionAgentName"];
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

  async handleOrganisationListPageChange(): Promise<void> {
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
    this.fetchOrganisationList();
  }

  async fetchOrganisationList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveOrganisationList(this.searchFilter)
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
      "RetrieveOrganisationList",
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
    if (field.apiName === "retrieveOrganisationList")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["retrieveOrganisationList"]
      );
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveOrganisationListSC"]);
  }

  updateSelectOptionsData() {}
}
