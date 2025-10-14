import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
    retrieveFacultyListDataObject,
    retrieveFacultyListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/faculty/retrieve-faculty-list';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {IResponseMessage, RetrieveListResponseModel} from 'src/app/shared/interfaces/dto/dto-base';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'app-retrieve-faculty-list',
  templateUrl: './retrieve-faculty-list.component.html',
  styleUrls: ['./retrieve-faculty-list.component.scss']
, imports: [CommonModule, RouterModule, NgbModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveFacultyListComponent extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  userActions : Array<any> = [];
  retrieveFacultyListSectionFields: any = [];
  retrieveFacultyListSectionData: any = {};
  retrieveFacultyListSelectOptionsData: any = {};


  selectedFacultyUUID: string = "";
  isUpdateFacultyFirstNameButtonDisabled = false;
  updateFacultyFirstNameSectionFields: any = [];
  updateFacultyFirstNameSectionData: any = {};
  updateFacultyFirstNameSelectOptionsData: any = {};

  
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveFacultyListSearchFilter = <retrieveFacultyListSearchFilter>{};
  pageResultsMap: Map<number, retrieveFacultyListDataObject[]> = new Map<number, retrieveFacultyListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  

  
  yesNoOptions = YES_NO_OPTIONS;
  retrieveFacultyListTableColumns : Array<any> = [];
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
    this.userActions = this.getUserActionsCustom('RetrieveFacultyList');
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */


    //Load table columns
    let retrieveFacultyListResponseParamList = await this.getApiResponseParameterListCustom('retrieveFacultyList', this.backendService, this.toastNotificationService);
    this.retrieveFacultyListTableColumns = this.getListApiTableColumnListCustom('retrieveFacultyList', retrieveFacultyListResponseParamList, this);
    //Load page fields
    let retrieveFacultyListRequestParamList = await this.getApiRequestParameterListCustom('retrieveFacultyList', this.backendService, this.toastNotificationService);
    this.retrieveFacultyListSectionFields = this.getSectionFieldsFromApiRequestParams('retrieveFacultyList', retrieveFacultyListRequestParamList, this);

    let updateFacultyFirstNameRequestParamList = await this.getApiRequestParameterListCustom('updateFacultyFirstName', this.backendService, this.toastNotificationService);
    this.updateFacultyFirstNameSectionFields = this.getSectionFieldsFromApiRequestParams('updateFacultyFirstName', updateFacultyFirstNameRequestParamList, this);
    this.setDataToFormOnload("retrieveFacultyList", this.router, this.currentRoute, this);
    this.onPageInit("retrieveFacultyList", this.currentRoute, this, ["retrieveFacultyListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveFacultyListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchFacultyList();
  }

  populateSearchFilterFromForm()
  {
    this.pageResultsMap.clear();
    this.searchFilter.firstName = this.retrieveFacultyListSectionData['firstName'];
    this.searchFilter.lastName = this.retrieveFacultyListSectionData['lastName'];
    this.searchFilter.emailId = this.retrieveFacultyListSectionData['emailId'];
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, this.searchFilter);
    if(numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return false;
    }
    return true;
  }

  async handleFacultyListPageChange(): Promise<void>
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
    this.fetchFacultyList();
  }

  async fetchFacultyList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(this.currentPage) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveFacultyList(this.searchFilter);
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
    this.executeUserActionCustom(actionName, 'RetrieveFacultyList', this.router, dataObject, this.backendService, this.toastNotificationService);
  }
  async onLookupValueSelected(selectedValue: any, field : any) {
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
  }
  async openUpdateFacultyFirstNamePopup(modal: any, selectedLineItemId : string)
  {
    this.selectedFacultyUUID = selectedLineItemId;
    this.updateFacultyFirstNameSectionData = {};
    let updateFacultyFirstNameRequestParamList = await this.getApiRequestParameterListCustom('updateFacultyFirstName', this.backendService, this.toastNotificationService);
    this.updateFacultyFirstNameSectionFields = this.getSectionFieldsFromApiRequestParams('updateFacultyFirstName', updateFacultyFirstNameRequestParamList, this);
    this.modalService.open(modal, { ariaLabelledBy: 'update-faculty-first-name-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.updateFacultyFirstNameSectionFields = [];
    }, (reason) => {
    this.updateFacultyFirstNameSectionFields = [];
    });
  }
  async updateFacultyFirstName(modal: any)
  {
    this.isUpdateFacultyFirstNameButtonDisabled = true;
    const facultyUUID = this.selectedFacultyUUID;
        const firstName= this.updateFacultyFirstNameSectionData['firstName'];
    const response: IResponseMessage = await this.backendService.updateFacultyFirstName(facultyUUID, firstName);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.pageResultsMap.clear();
      this.fetchFacultyList();
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateFacultyFirstNameButtonDisabled = false;
  }

  

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, ["retrieveFacultyListSC"]);
  }

  updateSelectOptionsData()
  {


  }
}
