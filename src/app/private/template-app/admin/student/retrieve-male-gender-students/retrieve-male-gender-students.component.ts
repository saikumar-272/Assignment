import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormsModule,} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {
    retrieveMaleGenderStudentsDataObject,
    retrieveMaleGenderStudentsSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/student/retrieve-male-gender-students";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-male-gender-students",
  imports: [CommonModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RouterModule, FormsModule, NgbModule, NgbPaginationModule],
  templateUrl: "./retrieve-male-gender-students.component.html",
  styleUrls: ["./retrieve-male-gender-students.component.scss"],
  standalone: true
})
export class RetrieveMaleGenderStudentsComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveMaleGenderStudentsSectionFields: any = [];
  retrieveMaleGenderStudentsSectionData: any = {};
  retrieveMaleGenderStudentsSelectOptionsData: any = {};

  selectedStudentUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveMaleGenderStudentsSearchFilter = <
    retrieveMaleGenderStudentsSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveMaleGenderStudentsDataObject[]> = new Map<
    number,
    retrieveMaleGenderStudentsDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveMaleGenderStudentsTableColumns: Array<any> = [];
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
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveMaleGenderStudents");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveMaleGenderStudentsResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveMaleGenderStudents",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveMaleGenderStudentsTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveMaleGenderStudents",
        retrieveMaleGenderStudentsResponseParamList,
        this
      );
    //Load page fields
    let retrieveMaleGenderStudentsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveMaleGenderStudents",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveMaleGenderStudentsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveMaleGenderStudents",
        retrieveMaleGenderStudentsRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveMaleGenderStudents",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveMaleGenderStudents", this.currentRoute, this, [
      "retrieveMaleGenderStudentsSC",
    ]);
  }

  async resetSearchCriteria() {
    this.retrieveMaleGenderStudentsSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchStudentList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.firstName =
      this.retrieveMaleGenderStudentsSectionData["firstName"];
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

  async handleStudentListPageChange(): Promise<void> {
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
    this.fetchStudentList();
  }

  async fetchStudentList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveMaleGenderStudents(this.searchFilter)
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
      "RetrieveMaleGenderStudents",
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
      "retrieveMaleGenderStudentsSC",
    ]);
  }

  updateSelectOptionsData() {
    this.retrieveMaleGenderStudentsSelectOptionsData["gender"] =
      OptionsList.Gender;
  }
}
