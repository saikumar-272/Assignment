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
    retrieveStateListDataObject,
    retrieveStateListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/state/retrieve-state-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-state-list",
  templateUrl: "./retrieve-state-list.component.html",
  styleUrls: ["./retrieve-state-list.component.scss"],
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, CommonModule, RouterModule, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveStateListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveStateListSectionFields: any = [];
  retrieveStateListSectionData: any = {};
  retrieveStateListSelectOptionsData: any = {};

  selectedStateUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveStateListSearchFilter = <
    retrieveStateListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveStateListDataObject[]> = new Map<
    number,
    retrieveStateListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  retrieveStateList_countryList: any[];
  selected_retrieveStateList_countryUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveStateListTableColumns: Array<any> = [];
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
    this.retrieveStateList_countryList = [];
    this.selected_retrieveStateList_countryUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveStateList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveStateListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStateList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStateListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveStateList",
      retrieveStateListResponseParamList,
      this
    );
    //Load page fields
    let retrieveStateListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveStateList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStateListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveStateList",
        retrieveStateListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveStateList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveStateList", this.currentRoute, this, [
      "retrieveStateListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveStateListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchStateList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.countryUUID =
      this.retrieveStateListSectionData["countryUUID"];
    this.searchFilter.name = this.retrieveStateListSectionData["name"];
    this.searchFilter.description =
      this.retrieveStateListSectionData["description"];
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

  async handleStateListPageChange(): Promise<void> {
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
    this.fetchStateList();
  }

  async fetchStateList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveStateList(this.searchFilter)
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
      "RetrieveStateList",
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
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {}

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveStateListSC"]);
  }

  updateSelectOptionsData() {}
}
