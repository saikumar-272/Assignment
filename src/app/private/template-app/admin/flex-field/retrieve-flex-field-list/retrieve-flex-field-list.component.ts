import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
    retrieveFlexFieldListDataObject,
    retrieveFlexFieldListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/flex-field/retrieve-flex-field-list';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {RetrieveListResponseModel} from 'src/app/shared/interfaces/dto/dto-base';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'app-retrieve-flex-field-list',
  templateUrl: './retrieve-flex-field-list.component.html',
  styleUrls: ['./retrieve-flex-field-list.component.scss']
, imports: [CommonModule, RouterModule, NgbModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule],
  standalone: true
})
export class RetrieveFlexFieldListComponent extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  userActions : Array<any> = [];
  retrieveFlexFieldListSectionFields: any = [];
  retrieveFlexFieldListSectionData: any = {};
  retrieveFlexFieldListSelectOptionsData: any = {};


  selectedFlexFieldUUID: string = "";

  
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveFlexFieldListSearchFilter = <retrieveFlexFieldListSearchFilter>{};
  pageResultsMap: Map<number, retrieveFlexFieldListDataObject[]> = new Map<number, retrieveFlexFieldListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  

  
  yesNoOptions = YES_NO_OPTIONS;
  retrieveFlexFieldListTableColumns : Array<any> = [];
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
    this.userActions = this.getUserActionsCustom('RetrieveFlexFieldList');
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */


    //Load table columns
    let retrieveFlexFieldListResponseParamList = await this.getApiResponseParameterListCustom('retrieveFlexFieldList', this.backendService, this.toastNotificationService);
    this.retrieveFlexFieldListTableColumns = this.getListApiTableColumnListCustom('retrieveFlexFieldList', retrieveFlexFieldListResponseParamList, this);
    //Load page fields
    let retrieveFlexFieldListRequestParamList = await this.getApiRequestParameterListCustom('retrieveFlexFieldList', this.backendService, this.toastNotificationService);
    this.retrieveFlexFieldListSectionFields = this.getSectionFieldsFromApiRequestParams('retrieveFlexFieldList', retrieveFlexFieldListRequestParamList, this);

    this.setDataToFormOnload("retrieveFlexFieldList", this.router, this.currentRoute, this);
    this.onPageInit("retrieveFlexFieldList", this.currentRoute, this, ["retrieveFlexFieldListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveFlexFieldListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchFlexFieldList();
  }

  populateSearchFilterFromForm()
  {
    this.pageResultsMap.clear();
    this.searchFilter.code = this.retrieveFlexFieldListSectionData['code'];
    this.searchFilter.name = this.retrieveFlexFieldListSectionData['name'];
    this.searchFilter.description = this.retrieveFlexFieldListSectionData['description'];
    this.searchFilter.enableContext = this.retrieveFlexFieldListSectionData['enableContext'];
    this.searchFilter.globalSegmentsCount = this.retrieveFlexFieldListSectionData['globalSegmentsCount'];
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, this.searchFilter);
    if(numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return false;
    }
    return true;
  }

  async handleFlexFieldListPageChange(): Promise<void>
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
    this.fetchFlexFieldList();
  }

  async fetchFlexFieldList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(this.currentPage) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveFlexFieldList(this.searchFilter);
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
    this.executeUserActionCustom(actionName, 'RetrieveFlexFieldList', this.router, dataObject, this.backendService, this.toastNotificationService);
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
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, ["retrieveFlexFieldListSC"]);
  }

  updateSelectOptionsData()
  {


  }
}
