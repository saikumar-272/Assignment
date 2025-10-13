import {
    ParentChildSectionFormComponent
} from 'src/app/shared/parent/child-section-forms/parent-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
    retrieveStudentLeaveListDataObject,
    retrieveStudentLeaveListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/student-leave/retrieve-student-leave-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-student-leave-list",
  templateUrl: "./retrieve-student-leave-list.component.html",
  imports: [NgbModule, CommonModule, ParentChildSectionFormComponent, RouterModule, NgbPaginationModule],
  styleUrls: ["./retrieve-student-leave-list.component.scss"],
  standalone: true
})
export class RetrieveStudentLeaveListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveStudentLeaveListSectionFields: any = [];
  retrieveStudentLeaveListSectionData: any = {};
  retrieveStudentLeaveListSelectOptionsData: any = {};

  selectedStudentLeaveUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveStudentLeaveListSearchFilter = <
    retrieveStudentLeaveListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveStudentLeaveListDataObject[]> = new Map<
    number,
    retrieveStudentLeaveListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveStudentLeaveListTableColumns: Array<any> = [];
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
    this.userActions = this.getUserActionsCustom("RetrieveStudentLeaveList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveStudentLeaveListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStudentLeaveList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentLeaveListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveStudentLeaveList",
        retrieveStudentLeaveListResponseParamList,
        this
      );
    //Load page fields
    let retrieveStudentLeaveListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveStudentLeaveList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentLeaveListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveStudentLeaveList",
        retrieveStudentLeaveListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveStudentLeaveList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveStudentLeaveList", this.currentRoute, this, [
      "retrieveStudentLeaveListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveStudentLeaveListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchStudentLeaveList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.name = this.retrieveStudentLeaveListSectionData["name"];
    this.searchFilter.leaveDate =
      this.retrieveStudentLeaveListSectionData["leaveDate"];
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

  async handleStudentLeaveListPageChange(): Promise<void> {
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
    this.fetchStudentLeaveList();
  }

  async fetchStudentLeaveList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveStudentLeaveList(this.searchFilter)
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
      "RetrieveStudentLeaveList",
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
      "retrieveStudentLeaveListSC"]);
  }

  updateSelectOptionsData() {}
}
