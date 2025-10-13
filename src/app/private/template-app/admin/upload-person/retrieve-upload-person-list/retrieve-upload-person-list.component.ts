import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormBuilder, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {
    retrieveUploadPersonListDataObject,
    retrieveUploadPersonListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/upload-person/retrieve-upload-person-list";
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
selector: "app-retrieve-upload-person-list",
  imports: [RouterModule, AdminChildSectionFormComponent, CommonModule, DynamicFieldDisplayComponent, NgbModule, FormsModule, NgbPaginationModule],
  templateUrl: "./retrieve-upload-person-list.component.html",
  styleUrls: ["./retrieve-upload-person-list.component.scss"],
  standalone: true
})
export class RetrieveUploadPersonListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveUploadPersonListSectionFields: any = [];
  retrieveUploadPersonListSectionData: any = {};
  retrieveUploadPersonListSelectOptionsData: any = {};

  isUploadUploadPersonButtonDisabled = false;
  uploadUploadPersonSectionFields: any = [];
  uploadUploadPersonSectionData: any = {};
  uploadUploadPersonSelectOptionsData: any = {};

  selectedUploadPersonUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveUploadPersonListSearchFilter = <
    retrieveUploadPersonListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveUploadPersonListDataObject[]> = new Map<
    number,
    retrieveUploadPersonListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  isAllItemsCheckboxSelected: boolean = false;

  retrieveUploadPersonList_locationList: any[];
  selected_retrieveUploadPersonList_locationUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveUploadPersonListTableColumns: Array<any> = [];
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
    this.retrieveUploadPersonList_locationList = [];
    this.selected_retrieveUploadPersonList_locationUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveUploadPersonList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveUploadPersonListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveUploadPersonList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUploadPersonListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveUploadPersonList",
        retrieveUploadPersonListResponseParamList,
        this
      );
    //Load page fields
    let retrieveUploadPersonListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveUploadPersonList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUploadPersonListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveUploadPersonList",
        retrieveUploadPersonListRequestParamList,
        this
      );
    let uploadUploadPersonRequestParamList =
      await this.getApiRequestParameterListCustom(
        "uploadUploadPerson",
        this.backendService,
        this.toastNotificationService
      );
    this.uploadUploadPersonSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "uploadUploadPerson",
        uploadUploadPersonRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveUploadPersonList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveUploadPersonList", this.currentRoute, this, [
      "retrieveUploadPersonListSC",
    ]);
  }

  async resetSearchCriteria() {
    this.retrieveUploadPersonListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchUploadPersonList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.firstName =
      this.retrieveUploadPersonListSectionData["firstName"];
    this.searchFilter.lastName =
      this.retrieveUploadPersonListSectionData["lastName"];
    this.searchFilter.address =
      this.retrieveUploadPersonListSectionData["address"];
    this.searchFilter.locationUUID =
      this.retrieveUploadPersonListSectionData["locationUUID"];
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

  async handleUploadPersonListPageChange(): Promise<void> {
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
    this.fetchUploadPersonList();
  }

  async fetchUploadPersonList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveUploadPersonList(this.searchFilter)
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

  downloadUploadPersonListFormat() {
    window.open(
      this.backendService.getApiUrl(
        "/upload-person/download-upload-person-list-format"
      ),
      "_blank"
    );
  }

  async openUploadUploadPersonPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "upload-upload-person-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.uploadUploadPersonSectionFields = [];
        },
        (reason) => {
          this.uploadUploadPersonSectionFields = [];
        }
      );
  }

  async uploadUploadPerson(modal: any) {
    this.isUploadUploadPersonButtonDisabled = true;
    const uploadDataRequestModel: IUploadDataRequestModel = {
      data: this.uploadUploadPersonSectionData["data"],
    };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Data",
      uploadDataRequestModel.data,
      1
    );
    if (errorMessage.length > 0) {
      this.isUploadUploadPersonButtonDisabled = false;
      this.toastNotificationService.showError(
        errorMessage,
        "Attachment size is more for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.uploadUploadPerson(uploadDataRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUploadUploadPersonButtonDisabled = false;
  }

  getSelectedLineItemIds() {
    let idsList: any = [];
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      let isSelected = this.searchResultObjectsList[i].isSelected;
      if (isSelected) {
        let selectedId = this.searchResultObjectsList[i].uploadPersonUUID;
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
      "RetrieveUploadPersonList",
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
      "retrieveUploadPersonListSC",
    ]);
  }

  updateSelectOptionsData() {}
}
