import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

import {
    retrieveEmployeeListDataObject,
    retrieveEmployeeListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/employee/retrieve-employee-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {CommonModule} from "@angular/common";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";

import { NgbModule, NgbPaginationModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "retrieve-employee-list-search-popup",
  imports: [DynamicFieldDisplayComponent, NgbModule, CommonModule, AdminChildSectionFormComponent, NgbPaginationModule],
  templateUrl: "./retrieve-employee-list-search-popup.component.html",
  styleUrls: ["./retrieve-employee-list-search-popup.component.scss"],
  standalone: true
})
export class RetrieveEmployeeListSearchPopupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  retrieveEmployeeListSectionFields: any = [];
  retrieveEmployeeListSectionData: any = {};
  retrieveEmployeeListSelectOptionsData: any = {};

  @ViewChild("retrieveEmployeeListSearchPopup")
  private retrieveEmployeeListSearchPopup!: TemplateRef<any>;
  retrieveEmployeeListSearchPopupReference!: NgbModalRef;

  @Output("retrieveEmployeeListSearchPopupParentMethodRef")
  retrieveEmployeeListSearchPopupParentMethodRef: EventEmitter<any> =
    new EventEmitter();

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveEmployeeListSearchFilter = <
    retrieveEmployeeListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveEmployeeListDataObject[]> = new Map<
    number,
    retrieveEmployeeListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveEmployeeListTableColumns: Array<any> = [];
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
    let retrieveEmployeeListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveEmployeeList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveEmployeeListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveEmployeeList",
        retrieveEmployeeListResponseParamList,
        this
      );
    //Load page fields
    let retrieveEmployeeListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveEmployeeList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveEmployeeListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveEmployeeList",
        retrieveEmployeeListRequestParamList,
        this
      );
  }

  async resetSearchCriteria() {
    this.retrieveEmployeeListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchFilter.joiningDateFrom =
      this.retrieveEmployeeListSectionData["joiningDateFrom"];
    this.searchFilter.joiningDateTo =
      this.retrieveEmployeeListSectionData["joiningDateTo"];
    this.searchFilter.firstName =
      this.retrieveEmployeeListSectionData["firstName"];
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
      await this.backendService.retrieveEmployeeList(this.searchFilter)
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

  showRetrieveEmployeeListSearchPopup(sectionName: string, fieldName: string) {
    this.processingSectionName = sectionName;
    this.processingFieldName = fieldName;
    this.retrieveEmployeeListSearchPopupReference = this.modalService.open(
      this.retrieveEmployeeListSearchPopup,
      { modalDialogClass: "modal-dialog" }
    );
    this.retrieveEmployeeListSearchPopupReference.result.then(
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
    this.retrieveEmployeeListSearchPopupParentMethodRef.emit(
      processingLookupInfo
    );
    this.retrieveEmployeeListSearchPopupReference.close();
  }

  async onLookupValueSelected(selectedValue: any, field: any) {}

  updateSelectOptionsData() {}
}
