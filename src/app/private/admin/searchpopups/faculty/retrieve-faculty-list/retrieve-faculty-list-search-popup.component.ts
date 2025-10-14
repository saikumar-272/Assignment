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
    retrieveFacultyListDataObject,
    retrieveFacultyListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/faculty/retrieve-faculty-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "retrieve-faculty-list-search-popup",
  imports: [DynamicFieldDisplayComponent, AdminChildSectionFormComponent, NgbModule, CommonModule, NgbPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./retrieve-faculty-list-search-popup.component.html",
  styleUrls: ["./retrieve-faculty-list-search-popup.component.scss"],
  standalone: true
})
export class RetrieveFacultyListSearchPopupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  retrieveFacultyListSectionFields: any = [];
  retrieveFacultyListSectionData: any = {};
  retrieveFacultyListSelectOptionsData: any = {};

  @ViewChild("retrieveFacultyListSearchPopup")
  private retrieveFacultyListSearchPopup!: TemplateRef<any>;
  retrieveFacultyListSearchPopupReference!: NgbModalRef;

  @Output("retrieveFacultyListSearchPopupParentMethodRef")
  retrieveFacultyListSearchPopupParentMethodRef: EventEmitter<any> =
    new EventEmitter();

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveFacultyListSearchFilter = <
    retrieveFacultyListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveFacultyListDataObject[]> = new Map<
    number,
    retrieveFacultyListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveFacultyListTableColumns: Array<any> = [];
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
    let retrieveFacultyListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveFacultyList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveFacultyListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveFacultyList",
      retrieveFacultyListResponseParamList,
      this
    );
    //Load page fields
    let retrieveFacultyListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveFacultyList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveFacultyListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveFacultyList",
        retrieveFacultyListRequestParamList,
        this
      );
  }

  async resetSearchCriteria() {
    this.retrieveFacultyListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchFilter.firstName =
      this.retrieveFacultyListSectionData["firstName"];
    this.searchFilter.lastName =
      this.retrieveFacultyListSectionData["lastName"];
    this.searchFilter.emailId = this.retrieveFacultyListSectionData["emailId"];
    this.fetchFacultyList();
  }

  async handleFacultyListPageChange(): Promise<void> {
    this.fetchFacultyList();
  }

  async fetchFacultyList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveFacultyList(this.searchFilter)
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

  showRetrieveFacultyListSearchPopup(sectionName: string, fieldName: string) {
    this.processingSectionName = sectionName;
    this.processingFieldName = fieldName;
    this.retrieveFacultyListSearchPopupReference = this.modalService.open(
      this.retrieveFacultyListSearchPopup,
      { modalDialogClass: "modal-dialog" }
    );
    this.retrieveFacultyListSearchPopupReference.result.then(
      async (result) => {},
      (reason) => {}
    );
  }

  setSelectedValue(searchResultObject: any) {
    let processingLookupInfo: any = {
      id: searchResultObject["facultyUUID"],
      displayText: searchResultObject["firstName"],
      processingSectionName: this.processingSectionName,
      processingFieldName: this.processingFieldName,
    };
    this.retrieveFacultyListSearchPopupParentMethodRef.emit(
      processingLookupInfo
    );
    this.retrieveFacultyListSearchPopupReference.close();
  }

  async onLookupValueSelected(selectedValue: any, field: any) {}

  updateSelectOptionsData() {}
}
