import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
    retrieveEmpLocationListDataObject,
    retrieveEmpLocationListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/emp-location/retrieve-emp-location-list';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {RetrieveListResponseModel} from 'src/app/shared/interfaces/dto/dto-base';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import OptionsList from 'src/app/shared/forms-custom/OptionsList.json';
import {RichTextEditorComponent} from 'src/app/private/editor/rich-text-editor.component';

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: 'app-retrieve-emp-location-list',
  templateUrl: './retrieve-emp-location-list.component.html',
  styleUrls: ['./retrieve-emp-location-list.component.scss']
, imports: [CommonModule, RouterModule, NgbModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveEmpLocationListComponent extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  userActions : Array<any> = [];
  retrieveEmpLocationListSectionFields: any = [];
  retrieveEmpLocationListSectionData: any = {};
  retrieveEmpLocationListSelectOptionsData: any = {};


  selectedEmpLocationUUID: string = "";

  
  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveEmpLocationListSearchFilter = <retrieveEmpLocationListSearchFilter>{};
  pageResultsMap: Map<number, retrieveEmpLocationListDataObject[]> = new Map<number, retrieveEmpLocationListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  

  
  yesNoOptions = YES_NO_OPTIONS;
  retrieveEmpLocationListTableColumns : Array<any> = [];
  isPaginationInitialized = false;
  
  @ViewChild('angularEditorPopupCompRef') angularEditorPopupCompRef!:RichTextEditorComponent;
  editorAngularEditorInputData! : string;

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
    this.userActions = this.getUserActionsCustom('RetrieveEmpLocationList');
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */


    //Load table columns
    let retrieveEmpLocationListResponseParamList = await this.getApiResponseParameterListCustom('retrieveEmpLocationList', this.backendService, this.toastNotificationService);
    this.retrieveEmpLocationListTableColumns = this.getListApiTableColumnListCustom('retrieveEmpLocationList', retrieveEmpLocationListResponseParamList, this);
    //Load page fields
    let retrieveEmpLocationListRequestParamList = await this.getApiRequestParameterListCustom('retrieveEmpLocationList', this.backendService, this.toastNotificationService);
    this.retrieveEmpLocationListSectionFields = this.getSectionFieldsFromApiRequestParams('retrieveEmpLocationList', retrieveEmpLocationListRequestParamList, this);

    this.setDataToFormOnload("retrieveEmpLocationList", this.router, this.currentRoute, this);
    this.onPageInit("retrieveEmpLocationList", this.currentRoute, this, ["retrieveEmpLocationListSC"]);
  }

  async resetSearchCriteria() {
    this.retrieveEmpLocationListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchEmpLocationList();
  }

  populateSearchFilterFromForm()
  {
    this.pageResultsMap.clear();
    this.searchFilter.locationName = this.retrieveEmpLocationListSectionData['locationName'];
    this.searchFilter.locationType = this.retrieveEmpLocationListSectionData['locationType'];
    this.searchFilter.enableLocationNameUpdate = this.retrieveEmpLocationListSectionData['enableLocationNameUpdate'];
    this.searchFilter.description = this.retrieveEmpLocationListSectionData['description'];
    this.searchFilter.excludeColumnTest = this.retrieveEmpLocationListSectionData['excludeColumnTest'];
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, this.searchFilter);
    if(numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return false;
    }
    return true;
  }

  async handleEmpLocationListPageChange(): Promise<void>
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
    this.fetchEmpLocationList();
  }

  async fetchEmpLocationList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(this.currentPage) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveEmpLocationList(this.searchFilter);
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
    this.executeUserActionCustom(actionName, 'RetrieveEmpLocationList', this.router, dataObject, this.backendService, this.toastNotificationService);
  }
  openAngularEditorPopup(retrieveEmpLocationListDataObject : any, fieldName : string)
  {
    let editorInputData = retrieveEmpLocationListDataObject[fieldName];
    if(1>2){}
    else if(fieldName == "editor1"){
      this.angularEditorPopupCompRef.showAngularEditorPopup('', fieldName, editorInputData, false);
    }
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
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, ["retrieveEmpLocationListSC"]);
  }

  updateSelectOptionsData()
  {
    this.retrieveEmpLocationListSelectOptionsData['locationType'] = OptionsList.LocationType;


  }
}
