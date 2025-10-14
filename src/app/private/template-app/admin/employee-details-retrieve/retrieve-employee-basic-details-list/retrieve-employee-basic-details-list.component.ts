import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
    retrieveEmployeeBasicDetailsListDataObject,
    retrieveEmployeeBasicDetailsListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/employee-details-retrieve/retrieve-employee-basic-details-list';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {RetrieveListResponseModel} from 'src/app/shared/interfaces/dto/dto-base';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'app-retrieve-employee-basic-details-list',
  templateUrl: './retrieve-employee-basic-details-list.component.html',
  styleUrls: ['./retrieve-employee-basic-details-list.component.scss']
, imports: [CommonModule, NgbModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveEmployeeBasicDetailsListComponent extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  userActions : Array<any> = [];
  retrieveEmployeeBasicDetailsListSectionFields: any = [];
  retrieveEmployeeBasicDetailsListSectionData: any = {};
  retrieveEmployeeBasicDetailsListSelectOptionsData: any = {};


  selectedEmployeeUUID: string = "";

  
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveEmployeeBasicDetailsListSearchFilter = <retrieveEmployeeBasicDetailsListSearchFilter>{};
  pageResultsMap: Map<number, retrieveEmployeeBasicDetailsListDataObject[]> = new Map<number, retrieveEmployeeBasicDetailsListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  

  
  yesNoOptions = YES_NO_OPTIONS;
  retrieveEmployeeBasicDetailsListTableColumns : Array<any> = [];
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
    this.userActions = this.getUserActionsCustom('RetrieveEmployeeBasicDetailsList');
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */


    //Load table columns
    let retrieveEmployeeBasicDetailsListResponseParamList = await this.getApiResponseParameterListCustom('retrieveEmployeeBasicDetailsList', this.backendService, this.toastNotificationService);
    this.retrieveEmployeeBasicDetailsListTableColumns = this.getListApiTableColumnListCustom('retrieveEmployeeBasicDetailsList', retrieveEmployeeBasicDetailsListResponseParamList, this);
    //Load page fields
    let retrieveEmployeeBasicDetailsListRequestParamList = await this.getApiRequestParameterListCustom('retrieveEmployeeBasicDetailsList', this.backendService, this.toastNotificationService);
    this.retrieveEmployeeBasicDetailsListSectionFields = this.getSectionFieldsFromApiRequestParams('retrieveEmployeeBasicDetailsList', retrieveEmployeeBasicDetailsListRequestParamList, this);

    this.setDataToFormOnload("retrieveEmployeeBasicDetailsList", this.router, this.currentRoute, this);
    this.onPageInit("retrieveEmployeeBasicDetailsList", this.currentRoute, this, ["retrieveEmployeeBasicDetailsListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveEmployeeBasicDetailsListSectionData = {};
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
    this.searchFilter.firstName = this.retrieveEmployeeBasicDetailsListSectionData['firstName'];
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
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveEmployeeBasicDetailsList(this.searchFilter);
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





  
  executeUserAction(actionName : any, dataObject : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveEmployeeBasicDetailsList', this.router, dataObject, this.backendService, this.toastNotificationService);
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
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, ["retrieveEmployeeBasicDetailsListSC"]);
  }

  updateSelectOptionsData()
  {


  }
}
