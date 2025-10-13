import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {
    retrieveUserRoleListDataObject,
    retrieveUserRoleListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/user-role/retrieve-user-role-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {IResponseMessage, RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-user-role-list",
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule, NgbPaginationModule],
  templateUrl: "./retrieve-user-role-list.component.html",
  styleUrls: ["./retrieve-user-role-list.component.scss"],
  standalone: true
})
export class RetrieveUserRoleListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveUserRoleListSectionFields: any = [];
  retrieveUserRoleListSectionData: any = {};
  retrieveUserRoleListSelectOptionsData: any = {};

  selectedUserRoleUUID: string = "";

  isDeleteUserRoleButtonDisabled = false;
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveUserRoleListSearchFilter = <
    retrieveUserRoleListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveUserRoleListDataObject[]> = new Map<
    number,
    retrieveUserRoleListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  retrieveUserRoleList_privilegeGroupList: any[];
  selected_retrieveUserRoleList_privilegeGroupUUID: string;
  retrieveUserRoleList_userInfoList: any[];
  selected_retrieveUserRoleList_userInfoUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveUserRoleListTableColumns: Array<any> = [];
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
    this.retrieveUserRoleList_privilegeGroupList = [];
    this.selected_retrieveUserRoleList_privilegeGroupUUID = "";
    this.retrieveUserRoleList_userInfoList = [];
    this.selected_retrieveUserRoleList_userInfoUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveUserRoleList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveUserRoleListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveUserRoleList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUserRoleListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveUserRoleList",
        retrieveUserRoleListResponseParamList,
        this
      );
    //Load page fields
    let retrieveUserRoleListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveUserRoleList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUserRoleListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveUserRoleList",
        retrieveUserRoleListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveUserRoleList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveUserRoleList", this.currentRoute, this, [
      "retrieveUserRoleListSC",
    ]);
  }

  async resetSearchCriteria() {
    this.retrieveUserRoleListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchUserRoleList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.privilegeGroupUUID =
      this.retrieveUserRoleListSectionData["privilegeGroupUUID"];
    this.searchFilter.description =
      this.retrieveUserRoleListSectionData["description"];
    this.searchFilter.userInfoUUID =
      this.retrieveUserRoleListSectionData["userInfoUUID"];
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

  async handleUserRoleListPageChange(): Promise<void> {
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
    this.fetchUserRoleList();
  }

  async fetchUserRoleList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveUserRoleList(this.searchFilter)
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
      "RetrieveUserRoleList",
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

  openDeleteUserRolePopup(modal: any, selectedRowUUID: any) {
    this.selectedUserRoleUUID = selectedRowUUID;
    this.modalService
      .open(modal, {
        ariaLabelledBy: "delete-user-role-title",
        modalDialogClass: "modal-dialog modal-dialog-centered",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }

  async deleteUserRole(modal: any) {
    this.isDeleteUserRoleButtonDisabled = true;
    const response: IResponseMessage = await this.backendService.deleteUserRole(
      this.selectedUserRoleUUID
    );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.searchResultObjectsList = this.searchResultObjectsList.filter(
        (item) => item.userRoleUUID !== this.selectedUserRoleUUID
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteUserRoleButtonDisabled = false;
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveUserRoleListSC",
    ]);
  }

  updateSelectOptionsData() {}
}
