import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
    retrieveCounryForUploadListDataObject,
    retrieveCounryForUploadListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/counry-for-upload/retrieve-counry-for-upload-list';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {
    IResponseMessage,
    IUploadDataRequestModel,
    RetrieveListResponseModel
} from 'src/app/shared/interfaces/dto/dto-base';
import {validateAttachmentSize} from 'src/app/shared/util/form-validators';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'app-retrieve-counry-for-upload-list',
  templateUrl: './retrieve-counry-for-upload-list.component.html',
  styleUrls: ['./retrieve-counry-for-upload-list.component.scss']
, imports: [CommonModule, FormsModule, RouterModule, NgbModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveCounryForUploadListComponent extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  userActions : Array<any> = [];
  retrieveCounryForUploadListSectionFields: any = [];
  retrieveCounryForUploadListSectionData: any = {};
  retrieveCounryForUploadListSelectOptionsData: any = {};

  isUploadCounryForUploadButtonDisabled = false;
  uploadCounryForUploadSectionFields: any = [];
  uploadCounryForUploadSectionData: any = {};
  uploadCounryForUploadSelectOptionsData: any = {};

  isDeleteCounryForUploadByIdsButtonDisabled = false;
  selectedCounryForUploadUUID: string = "";

  isDeleteCounryForUploadButtonDisabled = false;
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveCounryForUploadListSearchFilter = <retrieveCounryForUploadListSearchFilter>{};
  pageResultsMap: Map<number, retrieveCounryForUploadListDataObject[]> = new Map<number, retrieveCounryForUploadListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  isAllItemsCheckboxSelected: boolean = false;

  
  yesNoOptions = YES_NO_OPTIONS;
  retrieveCounryForUploadListTableColumns : Array<any> = [];
  isPaginationInitialized = false;
  

  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private route: Router, private currentRoute: ActivatedRoute,
    private fb: FormBuilder, private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
    {
      super();
      this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom('RetrieveCounryForUploadList');
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */


    //Load table columns
    let retrieveCounryForUploadListResponseParamList = await this.getApiResponseParameterListCustom('retrieveCounryForUploadList', this.backendService, this.toastNotificationService);
    this.retrieveCounryForUploadListTableColumns = this.getListApiTableColumnListCustom('retrieveCounryForUploadList', retrieveCounryForUploadListResponseParamList, this);
    //Load page fields
    let retrieveCounryForUploadListRequestParamList = await this.getApiRequestParameterListCustom('retrieveCounryForUploadList', this.backendService, this.toastNotificationService);
    this.retrieveCounryForUploadListSectionFields = this.getSectionFieldsFromApiRequestParams('retrieveCounryForUploadList', retrieveCounryForUploadListRequestParamList, this);
    let uploadCounryForUploadRequestParamList = await this.getApiRequestParameterListCustom('uploadCounryForUpload', this.backendService, this.toastNotificationService);
    this.uploadCounryForUploadSectionFields = this.getSectionFieldsFromApiRequestParams('uploadCounryForUpload', uploadCounryForUploadRequestParamList, this);

    this.setDataToFormOnload("retrieveCounryForUploadList", this.router, this.currentRoute, this);
    this.onPageInit("retrieveCounryForUploadList", this.currentRoute, this, ["retrieveCounryForUploadListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveCounryForUploadListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchCounryForUploadList();
  }

  populateSearchFilterFromForm()
  {
    this.pageResultsMap.clear();
    this.searchFilter.name = this.retrieveCounryForUploadListSectionData['name'];
    this.searchFilter.code = this.retrieveCounryForUploadListSectionData['code'];
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, this.searchFilter);
    if(numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return false;
    }
    return true;
  }

  async handleCounryForUploadListPageChange(): Promise<void>
  {
    // Skip the first auto-triggered page change on load
    if (!this.isPaginationInitialized) {
      this.isPaginationInitialized = true;
      return;
    }
    if (!this.populateSearchFilterFromForm())
    {
      this.searchResultObjectsList = [];
      this.pageResultsMap.clear();
      return;
    }
    this.fetchCounryForUploadList();
  }

  async fetchCounryForUploadList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(this.currentPage) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveCounryForUploadList(this.searchFilter);
    if(searchResponse.success == 0)
    {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }    
    if(searchResponse.alert) {
      this.toastNotificationService.showSuccess(searchResponse.alert);
    }
    else {
      this.searchResultObjectsList = searchResponse.list;
      this.collectionSize = searchResponse.matchingSearchResultsCount;
      this.noOfPages = searchResponse.totalPages;
      this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
    }
  }


  downloadCounryForUploadListFormat()
  {
  window.open(this.backendService.getApiUrl("/counry-for-upload/download-counry-for-upload-list-format"), '_blank');
  }

  async openUploadCounryForUploadPopup(modal: any)
  {
    this.modalService.open(modal, { ariaLabelledBy: 'upload-counry-for-upload-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
      this.uploadCounryForUploadSectionFields = [];
    }, (reason) => {
      this.uploadCounryForUploadSectionFields = [];
    });
  }


  async uploadCounryForUpload(modal: any)
  {
    this.isUploadCounryForUploadButtonDisabled = true;
    const uploadDataRequestModel: IUploadDataRequestModel =
    {
      data: this.uploadCounryForUploadSectionData['data'],
    };
    let errorMessage : string = "";
    errorMessage += validateAttachmentSize("Data", uploadDataRequestModel.data, 1);
    if(errorMessage.length > 0)
    {
      this.isUploadCounryForUploadButtonDisabled = false;
      this.toastNotificationService.showError(errorMessage, "Attachment size is more for below fields.");
      return;
    }
    const response: IResponseMessage = await this.backendService.uploadCounryForUpload(uploadDataRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUploadCounryForUploadButtonDisabled = false;
  }

  async openDeleteCounryForUploadByIdsPopup(modal: any)
  {
    this.modalService.open(modal, { ariaLabelledBy: 'delete-counry-for-upload-by-ids-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    }, (reason) => {
    });
  }

  async deleteCounryForUploadByIds(modal: any)
  {
    this.isDeleteCounryForUploadByIdsButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if(ids == null || ids.length == 0)
    {
      this.isDeleteCounryForUploadByIdsButtonDisabled = false;
      this.toastNotificationService.showError("Select atleast one line item to process the request.");
      return;
    }
    const response: IResponseMessage = await this.backendService.deleteCounryForUploadByIds(ids);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteCounryForUploadByIdsButtonDisabled = false;
  }
  getSelectedLineItemIds()
  {
    let idsList : any = [];
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
        let isSelected = this.searchResultObjectsList[i].isSelected;
        if(isSelected) {
            let selectedId = this.searchResultObjectsList[i].counryForUploadUUID;
            idsList.push(selectedId);
        }
    }
    return idsList;
  }
  toggleAllItemsSelectionCheckbox() 
  {
    for (let i = 0; i < this.searchResultObjectsList.length; i++) 
    {
        this.searchResultObjectsList[i].isSelected = !this.isAllItemsCheckboxSelected;
    }
  }
  executeUserAction(actionName : any, dataObject : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveCounryForUploadList', this.router, dataObject, this.backendService, this.toastNotificationService);
  }
  async onLookupValueSelected(selectedValue: any, field : any) {
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
  }

  openDeleteCounryForUploadPopup(modal: any, selectedRowUUID : any)
  {
    this.selectedCounryForUploadUUID = selectedRowUUID;
    this.modalService.open(modal, { ariaLabelledBy: 'delete-counry-for-upload-title', modalDialogClass:"modal-dialog modal-dialog-centered" }).result.then(async (result) => {
    }, (reason) => {
    });
  }

  async deleteCounryForUpload(modal: any)
  {
    this.isDeleteCounryForUploadButtonDisabled = true;
    const response: IResponseMessage = await this.backendService.deleteCounryForUpload(this.selectedCounryForUploadUUID);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.searchResultObjectsList = this.searchResultObjectsList.filter(
        item => item.counryForUploadUUID !== this.selectedCounryForUploadUUID
      );
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteCounryForUploadButtonDisabled = false;
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, ["retrieveCounryForUploadListSC"]);
  }

  updateSelectOptionsData()
  {


  }
}
