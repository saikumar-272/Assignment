import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormBuilder, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {
    retrieveStateForUploadListDataObject,
    retrieveStateForUploadListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/state-for-upload/retrieve-state-for-upload-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {
    IResponseMessage,
    IUploadDataRequestModel,
    RetrieveListResponseModel,
} from "src/app/shared/interfaces/dto/dto-base";
import {validateAttachmentSize,} from "src/app/shared/util/form-validators";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-state-for-upload-list",
  imports: [CommonModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RouterModule, FormsModule, NgbModule, NgbPaginationModule],
  templateUrl: "./retrieve-state-for-upload-list.component.html",
  styleUrls: ["./retrieve-state-for-upload-list.component.scss"],
  standalone: true
})
export class RetrieveStateForUploadListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveStateForUploadListSectionFields: any = [];
  retrieveStateForUploadListSectionData: any = {};
  retrieveStateForUploadListSelectOptionsData: any = {};

  isUploadStateForUploadButtonDisabled = false;
  uploadStateForUploadSectionFields: any = [];
  uploadStateForUploadSectionData: any = {};
  uploadStateForUploadSelectOptionsData: any = {};

  isDeleteStateForUploadByIdsButtonDisabled = false;
  selectedStateForUploadUUID: string = "";

  isDeleteStateForUploadButtonDisabled = false;
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveStateForUploadListSearchFilter = <
    retrieveStateForUploadListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveStateForUploadListDataObject[]> = new Map<
    number,
    retrieveStateForUploadListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  isAllItemsCheckboxSelected: boolean = false;

  retrieveStateForUploadList_countryList: any[];
  selected_retrieveStateForUploadList_countryUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveStateForUploadListTableColumns: Array<any> = [];
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
    this.retrieveStateForUploadList_countryList = [];
    this.selected_retrieveStateForUploadList_countryUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveStateForUploadList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveStateForUploadListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStateForUploadList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStateForUploadListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveStateForUploadList",
        retrieveStateForUploadListResponseParamList,
        this
      );
    //Load page fields
    let retrieveStateForUploadListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveStateForUploadList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStateForUploadListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveStateForUploadList",
        retrieveStateForUploadListRequestParamList,
        this
      );
    let uploadStateForUploadRequestParamList =
      await this.getApiRequestParameterListCustom(
        "uploadStateForUpload",
        this.backendService,
        this.toastNotificationService
      );
    this.uploadStateForUploadSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "uploadStateForUpload",
        uploadStateForUploadRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveStateForUploadList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveStateForUploadList", this.currentRoute, this, [
      "retrieveStateForUploadListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveStateForUploadListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchStateForUploadList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.name = this.retrieveStateForUploadListSectionData["name"];
    this.searchFilter.code = this.retrieveStateForUploadListSectionData["code"];
    this.searchFilter.countryUUID =
      this.retrieveStateForUploadListSectionData["countryUUID"];
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

  async handleStateForUploadListPageChange(): Promise<void> {
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
    this.fetchStateForUploadList();
  }

  async fetchStateForUploadList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveStateForUploadList(this.searchFilter)
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

  downloadStateForUploadListFormat() {
    window.open(
      this.backendService.getApiUrl(
        "/state-for-upload/download-state-for-upload-list-format"
      ),
      "_blank"
    );
  }

  async openUploadStateForUploadPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "upload-state-for-upload-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.uploadStateForUploadSectionFields = [];
        },
        (reason) => {
          this.uploadStateForUploadSectionFields = [];
        }
      );
  }

  async uploadStateForUpload(modal: any) {
    this.isUploadStateForUploadButtonDisabled = true;
    const uploadDataRequestModel: IUploadDataRequestModel = {
      data: this.uploadStateForUploadSectionData["data"],
    };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Data",
      uploadDataRequestModel.data,
      1
    );
    if (errorMessage.length > 0) {
      this.isUploadStateForUploadButtonDisabled = false;
      this.toastNotificationService.showError(
        errorMessage,
        "Attachment size is more for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.uploadStateForUpload(uploadDataRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUploadStateForUploadButtonDisabled = false;
  }

  async openDeleteStateForUploadByIdsPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "delete-state-for-upload-by-ids-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }

  async deleteStateForUploadByIds(modal: any) {
    this.isDeleteStateForUploadByIdsButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if (ids == null || ids.length == 0) {
      this.isDeleteStateForUploadByIdsButtonDisabled = false;
      this.toastNotificationService.showError(
        "Select atleast one line item to process the request."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.deleteStateForUploadByIds(ids);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteStateForUploadByIdsButtonDisabled = false;
  }
  getSelectedLineItemIds() {
    let idsList: any = [];
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      let isSelected = this.searchResultObjectsList[i].isSelected;
      if (isSelected) {
        let selectedId = this.searchResultObjectsList[i].stateForUploadUUID;
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
      "RetrieveStateForUploadList",
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

  openDeleteStateForUploadPopup(modal: any, selectedRowUUID: any) {
    this.selectedStateForUploadUUID = selectedRowUUID;
    this.modalService
      .open(modal, {
        ariaLabelledBy: "delete-state-for-upload-title",
        modalDialogClass: "modal-dialog modal-dialog-centered",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }

  async deleteStateForUpload(modal: any) {
    this.isDeleteStateForUploadButtonDisabled = true;
    const response: IResponseMessage =
      await this.backendService.deleteStateForUpload(
        this.selectedStateForUploadUUID
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.searchResultObjectsList = this.searchResultObjectsList.filter(
        (item) => item.stateForUploadUUID !== this.selectedStateForUploadUUID
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteStateForUploadButtonDisabled = false;
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveStateForUploadListSC"]);
  }

  updateSelectOptionsData() {}
}
