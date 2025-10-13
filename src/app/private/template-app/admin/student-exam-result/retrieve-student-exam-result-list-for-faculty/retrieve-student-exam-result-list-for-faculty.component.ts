import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {
    retrieveStudentExamResultListForFacultyDataObject,
    retrieveStudentExamResultListForFacultySearchFilter,
} from "src/app/shared/interfaces/dto/template-app/student-exam-result/retrieve-student-exam-result-list-for-faculty";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-student-exam-result-list-for-faculty",
  imports: [RouterModule, CommonModule, AdminChildSectionFormComponent, NgbModule, DynamicFieldDisplayComponent, NgbPaginationModule],

  templateUrl: "./retrieve-student-exam-result-list-for-faculty.component.html",
  styleUrls: ["./retrieve-student-exam-result-list-for-faculty.component.scss"],
  standalone: true
})
export class RetrieveStudentExamResultListForFacultyComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveStudentExamResultListForFacultySectionFields: any = [];
  retrieveStudentExamResultListForFacultySectionData: any = {};
  retrieveStudentExamResultListForFacultySelectOptionsData: any = {};

  selectedStudentExamResultUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveStudentExamResultListForFacultySearchFilter = <
    retrieveStudentExamResultListForFacultySearchFilter
  >{};
  pageResultsMap: Map<
    number,
    retrieveStudentExamResultListForFacultyDataObject[]
  > = new Map<number, retrieveStudentExamResultListForFacultyDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  retrieveStudentExamResultListForFaculty_facultyList: any[];
  selected_retrieveStudentExamResultListForFaculty_facultyUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveStudentExamResultListForFacultyTableColumns: Array<any> = [];
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
    this.retrieveStudentExamResultListForFaculty_facultyList = [];
    this.selected_retrieveStudentExamResultListForFaculty_facultyUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom(
      "RetrieveStudentExamResultListForFaculty"
    );
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveStudentExamResultListForFacultyResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStudentExamResultListForFaculty",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentExamResultListForFacultyTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveStudentExamResultListForFaculty",
        retrieveStudentExamResultListForFacultyResponseParamList,
        this
      );
    //Load page fields
    let retrieveStudentExamResultListForFacultyRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveStudentExamResultListForFaculty",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentExamResultListForFacultySectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveStudentExamResultListForFaculty",
        retrieveStudentExamResultListForFacultyRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveStudentExamResultListForFaculty",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "retrieveStudentExamResultListForFaculty",
      this.currentRoute,
      this,
      ["retrieveStudentExamResultListForFacultySC"]
    );
  }

  async resetSearchCriteria() {
    this.retrieveStudentExamResultListForFacultySectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchStudentExamResultList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.facultyUUID =
      this.retrieveStudentExamResultListForFacultySectionData["facultyUUID"];
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

  async handleStudentExamResultListPageChange(): Promise<void> {
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
    this.fetchStudentExamResultList();
  }

  async fetchStudentExamResultList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveStudentExamResultListForFaculty(
        this.searchFilter
      )
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

  executeUserAction(actionName: any, dataObject: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveStudentExamResultListForFaculty",
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
      "retrieveStudentExamResultListForFacultySC"]);
  }

  updateSelectOptionsData() {}
}
