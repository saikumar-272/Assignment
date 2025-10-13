import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {
    retrieveParentListDataObject,
    retrieveParentListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/parent/retrieve-parent-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {IResponseMessage, RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";


import {
    IUpdateParentsMobileNumberRequestModel
} from "src/app/shared/interfaces/dto/template-app/parent/update-parents-mobile-number";

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
selector: "app-retrieve-parent-list",
  templateUrl: "./retrieve-parent-list.component.html",
  styleUrls: ["./retrieve-parent-list.component.scss"],
  imports: [AdminChildSectionFormComponent,  DynamicFieldDisplayComponent, NgbModule, FormsModule, CommonModule, RouterModule, NgbPaginationModule],
  standalone: true
})
export class RetrieveParentListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveParentListSectionFields: any = [];
  retrieveParentListSectionData: any = {};
  retrieveParentListSelectOptionsData: any = {};

  isUpdateParentsMobileNumberButtonDisabled = false;
  selectedParentUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveParentListSearchFilter = <
    retrieveParentListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveParentListDataObject[]> = new Map<
    number,
    retrieveParentListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  isAllItemsCheckboxSelected: boolean = false;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveParentListTableColumns: Array<any> = [];
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
    this.userActions = this.getUserActionsCustom("RetrieveParentList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveParentListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveParentList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveParentListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveParentList",
      retrieveParentListResponseParamList,
      this
    );
    //Load page fields
    let retrieveParentListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveParentList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveParentListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveParentList",
        retrieveParentListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveParentList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveParentList", this.currentRoute, this, [
      "retrieveParentListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveParentListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchParentList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.firstName =
      this.retrieveParentListSectionData["firstName"];
    this.searchFilter.lastName = this.retrieveParentListSectionData["lastName"];
    this.searchFilter.mobileNumber =
      this.retrieveParentListSectionData["mobileNumber"];
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

  async handleParentListPageChange(): Promise<void> {
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
    this.fetchParentList();
  }

  async fetchParentList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveParentList(this.searchFilter)
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

  async openUpdateParentsMobileNumberPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-parents-mobile-number-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }

  async updateParentsMobileNumber(modal: any) {
    this.isUpdateParentsMobileNumberButtonDisabled = true;
    let list: Array<any> = [];
    let isValidData: boolean = true;
    let invalidRowNos = "";
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      let isSelected = this.searchResultObjectsList[i].isSelected;
      if (isSelected) {
        let parentUUID = this.searchResultObjectsList[i].parentUUID;
        let validRowData = true;
        let mobileNumber: any =
          this.searchResultObjectsList[i].mobileNumberForUpdate;
        if (mobileNumber == null || mobileNumber.length == 0) {
          validRowData = false;
        }
        if (!validRowData) {
          invalidRowNos = invalidRowNos + (i + 1) + ",";
          isValidData = false;
        }
        list.push({
          parentUUID: parentUUID,
          mobileNumber: mobileNumber,
        });
      }
    }
    if (!isValidData) {
      this.isUpdateParentsMobileNumberButtonDisabled = false;
      if (invalidRowNos.length > 0) {
        invalidRowNos = invalidRowNos.substring(0, invalidRowNos.length - 1);
      }
      this.toastNotificationService.showError(
        " Data missing for selected records at row nos : '" +
          invalidRowNos +
          "'. Enter the missing data and try again."
      );
      return;
    }
    if (list == null || list.length == 0) {
      this.isUpdateParentsMobileNumberButtonDisabled = false;
      this.toastNotificationService.showError(
        "Select atleast one line item to process the request."
      );
      return;
    }
    const updateParentsMobileNumberRequestModel: IUpdateParentsMobileNumberRequestModel =
      {
        list: [],
      };
    updateParentsMobileNumberRequestModel["list"] = list;
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      updateParentsMobileNumberRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateParentsMobileNumberButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.updateParentsMobileNumber(
        updateParentsMobileNumberRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateParentsMobileNumberButtonDisabled = false;
  }
  getSelectedLineItemIds() {
    let idsList: any = [];
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      let isSelected = this.searchResultObjectsList[i].isSelected;
      if (isSelected) {
        let selectedId = this.searchResultObjectsList[i].parentUUID;
        idsList.push(selectedId);
      }
    }
    return idsList;
  }
  toggleAllItemsSelectionCheckbox() {
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      this.searchResultObjectsList[i].isSelected =
        !this.isAllItemsCheckboxSelected;
    }
  }
  executeUserAction(actionName: any, dataObject: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveParentList",
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
      "retrieveParentListSC"]);
  }

  updateSelectOptionsData() {}
}
