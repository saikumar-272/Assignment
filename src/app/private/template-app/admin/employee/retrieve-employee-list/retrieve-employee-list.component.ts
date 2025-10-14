import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
    retrieveEmployeeListDataObject,
    retrieveEmployeeListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/employee/retrieve-employee-list';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {IResponseMessage, RetrieveListResponseModel} from 'src/app/shared/interfaces/dto/dto-base';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'app-retrieve-employee-list',
  templateUrl: './retrieve-employee-list.component.html',
  styleUrls: ['./retrieve-employee-list.component.scss']
, imports: [CommonModule, FormsModule, RouterModule, NgbModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveEmployeeListComponent extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  userActions : Array<any> = [];
  retrieveEmployeeListSectionFields: any = [];
  retrieveEmployeeListSectionData: any = {};
  retrieveEmployeeListSelectOptionsData: any = {};


  isUpdateSelectedEmployeesButtonDisabled = false;
  isDeleteEmployeeByIdsButtonDisabled = false;
  selectedEmployeeUUID: string = "";

  
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveEmployeeListSearchFilter = <retrieveEmployeeListSearchFilter>{};
  pageResultsMap: Map<number, retrieveEmployeeListDataObject[]> = new Map<number, retrieveEmployeeListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  isAllItemsCheckboxSelected: boolean = false;

  
  yesNoOptions = YES_NO_OPTIONS;
  retrieveEmployeeListTableColumns : Array<any> = [];
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
    this.userActions = this.getUserActionsCustom('RetrieveEmployeeList');
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */


    //Load table columns
    let retrieveEmployeeListResponseParamList = await this.getApiResponseParameterListCustom('retrieveEmployeeList', this.backendService, this.toastNotificationService);
    this.retrieveEmployeeListTableColumns = this.getListApiTableColumnListCustom('retrieveEmployeeList', retrieveEmployeeListResponseParamList, this);
    //Load page fields
    let retrieveEmployeeListRequestParamList = await this.getApiRequestParameterListCustom('retrieveEmployeeList', this.backendService, this.toastNotificationService);
    this.retrieveEmployeeListSectionFields = this.getSectionFieldsFromApiRequestParams('retrieveEmployeeList', retrieveEmployeeListRequestParamList, this);

    this.setDataToFormOnload("retrieveEmployeeList", this.router, this.currentRoute, this);
    this.onPageInit("retrieveEmployeeList", this.currentRoute, this, ["retrieveEmployeeListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveEmployeeListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchEmployeeList();
  }

  populateSearchFilterFromForm()
  {
    this.pageResultsMap.clear();
    this.searchFilter.joiningDateFrom = this.retrieveEmployeeListSectionData['joiningDateFrom'];
    this.searchFilter.joiningDateTo = this.retrieveEmployeeListSectionData['joiningDateTo'];
    this.searchFilter.firstName = this.retrieveEmployeeListSectionData['firstName'];
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, this.searchFilter);
    if(numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return false;
    }
    return true;
  }

  async handleEmployeeListPageChange(): Promise<void>
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
    this.fetchEmployeeList();
  }

  async fetchEmployeeList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(this.currentPage) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveEmployeeList(this.searchFilter);
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




  async openUpdateSelectedEmployeesPopup(modal: any)
  {
    this.modalService.open(modal, { ariaLabelledBy: 'update-selected-employees-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    }, (reason) => {
    });
  }
  async openDeleteEmployeeByIdsPopup(modal: any)
  {
    this.modalService.open(modal, { ariaLabelledBy: 'delete-employee-by-ids-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    }, (reason) => {
    });
  }

  async updateSelectedEmployees(modal: any)
  {
    this.isUpdateSelectedEmployeesButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if(ids == null || ids.length == 0)
    {
      this.isUpdateSelectedEmployeesButtonDisabled = false;
      this.toastNotificationService.showError("Select atleast one line item to process the request.");
      return;
    }
    const response: IResponseMessage = await this.backendService.updateSelectedEmployees(ids);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateSelectedEmployeesButtonDisabled = false;
  }
  async deleteEmployeeByIds(modal: any)
  {
    this.isDeleteEmployeeByIdsButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if(ids == null || ids.length == 0)
    {
      this.isDeleteEmployeeByIdsButtonDisabled = false;
      this.toastNotificationService.showError("Select atleast one line item to process the request.");
      return;
    }
    const response: IResponseMessage = await this.backendService.deleteEmployeeByIds(ids);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteEmployeeByIdsButtonDisabled = false;
  }
  getSelectedLineItemIds()
  {
    let idsList : any = [];
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
        let isSelected = this.searchResultObjectsList[i].isSelected;
        if(isSelected) {
            let selectedId = this.searchResultObjectsList[i].employeeUUID;
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
    this.executeUserActionCustom(actionName, 'RetrieveEmployeeList', this.router, dataObject, this.backendService, this.toastNotificationService);
  }
  async onLookupValueSelected(selectedValue: any, field : any) {
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
  }

  

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, ["retrieveEmployeeListSC"]);
  }

  updateSelectOptionsData()
  {


  }
}
