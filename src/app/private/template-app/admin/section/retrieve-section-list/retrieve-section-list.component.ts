import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {
    retrieveSectionListDataObject,
    retrieveSectionListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/section/retrieve-section-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-section-list",
  templateUrl: "./retrieve-section-list.component.html",
  styleUrls: ["./retrieve-section-list.component.scss"],
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, CommonModule, RouterModule, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveSectionListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveSectionListSectionFields: any = [];
  retrieveSectionListSectionData: any = {};
  retrieveSectionListSelectOptionsData: any = {};

  selectedSectionUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveSectionListSearchFilter = <
    retrieveSectionListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveSectionListDataObject[]> = new Map<
    number,
    retrieveSectionListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  retrieveSectionList_classInfoList: any[];
  selected_retrieveSectionList_classInfoUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveSectionListTableColumns: Array<any> = [];
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
    this.retrieveSectionList_classInfoList = [];
    this.selected_retrieveSectionList_classInfoUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveSectionList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveSectionListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveSectionList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSectionListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveSectionList",
      retrieveSectionListResponseParamList,
      this
    );
    //Load page fields
    let retrieveSectionListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveSectionList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSectionListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveSectionList",
        retrieveSectionListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveSectionList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveSectionList", this.currentRoute, this, [
      "retrieveSectionListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveSectionListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchSectionList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.classInfoUUID =
      this.retrieveSectionListSectionData["classInfoUUID"];
    this.searchFilter.name = this.retrieveSectionListSectionData["name"];
    this.searchFilter.description =
      this.retrieveSectionListSectionData["description"];
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

  async handleSectionListPageChange(): Promise<void> {
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
    this.fetchSectionList();
  }

  async fetchSectionList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveSectionList(this.searchFilter)
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
      "RetrieveSectionList",
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
      "retrieveSectionListSC"]);
  }

  updateSelectOptionsData() {}
}
