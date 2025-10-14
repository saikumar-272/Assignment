import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {CommonModule} from '@angular/common';
import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {
    retrieveEmployeeBasicDetailsListDataObject,
    retrieveEmployeeBasicDetailsListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/employee-details-retrieve/retrieve-employee-basic-details-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "retrieve-employee-basic-details-list-search-popup",
  imports: [DynamicFieldDisplayComponent, NgbModule, CommonModule, AdminChildSectionFormComponent, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl:
    "./retrieve-employee-basic-details-list-search-popup.component.html",
  styleUrls: [
    "./retrieve-employee-basic-details-list-search-popup.component.scss"],
  standalone: true
})
export class RetrieveEmployeeBasicDetailsListSearchPopupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  retrieveEmployeeBasicDetailsListSectionFields: any = [];
  retrieveEmployeeBasicDetailsListSectionData: any = {};
  retrieveEmployeeBasicDetailsListSelectOptionsData: any = {};

  @ViewChild("retrieveEmployeeBasicDetailsListSearchPopup")
  private retrieveEmployeeBasicDetailsListSearchPopup!: TemplateRef<any>;
  retrieveEmployeeBasicDetailsListSearchPopupReference!: NgbModalRef;

  @Output("retrieveEmployeeBasicDetailsListSearchPopupParentMethodRef")
  retrieveEmployeeBasicDetailsListSearchPopupParentMethodRef: EventEmitter<any> =
    new EventEmitter();

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveEmployeeBasicDetailsListSearchFilter = <
    retrieveEmployeeBasicDetailsListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveEmployeeBasicDetailsListDataObject[]> =
    new Map<number, retrieveEmployeeBasicDetailsListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveEmployeeBasicDetailsListTableColumns: Array<any> = [];
  processingSectionName: string = "";
  processingFieldName: string = "";

  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private route: Router,
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

    //Load table columns
    let retrieveEmployeeBasicDetailsListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveEmployeeBasicDetailsList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveEmployeeBasicDetailsListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveEmployeeBasicDetailsList",
        retrieveEmployeeBasicDetailsListResponseParamList,
        this
      );
    //Load page fields
    let retrieveEmployeeBasicDetailsListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveEmployeeBasicDetailsList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveEmployeeBasicDetailsListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveEmployeeBasicDetailsList",
        retrieveEmployeeBasicDetailsListRequestParamList,
        this
      );
  }

  async resetSearchCriteria() {
    this.retrieveEmployeeBasicDetailsListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchFilter.firstName =
      this.retrieveEmployeeBasicDetailsListSectionData["firstName"];
    this.fetchEmployeeList();
  }

  async handleEmployeeListPageChange(): Promise<void> {
    this.fetchEmployeeList();
  }

  async fetchEmployeeList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveEmployeeBasicDetailsList(
        this.searchFilter
      )
    );
    if (searchResponse.success == 0) {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }
    this.searchResultObjectsList = searchResponse.list;
    this.collectionSize = searchResponse.matchingSearchResultsCount;
    this.noOfPages = searchResponse.totalPages;
    this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
  }

  showRetrieveEmployeeBasicDetailsListSearchPopup(
    sectionName: string,
    fieldName: string
  ) {
    this.processingSectionName = sectionName;
    this.processingFieldName = fieldName;
    this.retrieveEmployeeBasicDetailsListSearchPopupReference =
      this.modalService.open(this.retrieveEmployeeBasicDetailsListSearchPopup, {
        modalDialogClass: "modal-dialog",
      });
    this.retrieveEmployeeBasicDetailsListSearchPopupReference.result.then(
      async (result) => {},
      (reason) => {}
    );
  }

  setSelectedValue(searchResultObject: any) {
    let processingLookupInfo: any = {
      id: searchResultObject["employeeUUID"],
      displayText: searchResultObject["firstName"],
      processingSectionName: this.processingSectionName,
      processingFieldName: this.processingFieldName,
    };
    this.retrieveEmployeeBasicDetailsListSearchPopupParentMethodRef.emit(
      processingLookupInfo
    );
    this.retrieveEmployeeBasicDetailsListSearchPopupReference.close();
  }

  async onLookupValueSelected(selectedValue: any, field: any) {}

  updateSelectOptionsData() {}
}
