import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
    retrieveUserInfoListDataObject,
    retrieveUserInfoListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/user-info/retrieve-user-info-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-user-info-list",
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule, NgbPaginationModule],
  templateUrl: "./retrieve-user-info-list.component.html",
  styleUrls: ["./retrieve-user-info-list.component.scss"],
  standalone: true
})
export class RetrieveUserInfoListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveUserInfoListSectionFields: any = [];
  retrieveUserInfoListSectionData: any = {};
  retrieveUserInfoListSelectOptionsData: any = {};

  selectedUserInfoUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveUserInfoListSearchFilter = <
    retrieveUserInfoListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveUserInfoListDataObject[]> = new Map<
    number,
    retrieveUserInfoListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveUserInfoListTableColumns: Array<any> = [];
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
    this.userActions = this.getUserActionsCustom("RetrieveUserInfoList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveUserInfoListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveUserInfoList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUserInfoListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveUserInfoList",
        retrieveUserInfoListResponseParamList,
        this
      );
    //Load page fields
    let retrieveUserInfoListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveUserInfoList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUserInfoListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveUserInfoList",
        retrieveUserInfoListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveUserInfoList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveUserInfoList", this.currentRoute, this, [
      "retrieveUserInfoListSC",
    ]);
  }

  async resetSearchCriteria() {
    this.retrieveUserInfoListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchUserInfoList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.emailId = this.retrieveUserInfoListSectionData["emailId"];
    this.searchFilter.contactNo =
      this.retrieveUserInfoListSectionData["contactNo"];
    this.searchFilter.firstName =
      this.retrieveUserInfoListSectionData["firstName"];
    this.searchFilter.lastName =
      this.retrieveUserInfoListSectionData["lastName"];
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

  async handleUserInfoListPageChange(): Promise<void> {
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
    this.fetchUserInfoList();
  }

  async fetchUserInfoList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveUserInfoList(this.searchFilter)
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
      "RetrieveUserInfoList",
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
      "retrieveUserInfoListSC",
    ]);
  }

  updateSelectOptionsData() {}
}
