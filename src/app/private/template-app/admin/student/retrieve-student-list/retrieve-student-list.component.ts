import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';

import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormBuilder, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from "@angular/core";
import {
    retrieveStudentListDataObject,
    retrieveStudentListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/student/retrieve-student-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {DropDownOption} from "src/app/shared/interfaces/dropdown_option";
import {IResponseMessage, RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";


import {
    IUpdateStudentByIdsRequestModel
} from "src/app/shared/interfaces/dto/template-app/student/update-student-by-ids";
import {
    ISendSmsToSelectedStudentsRequestModel
} from "src/app/shared/interfaces/dto/template-app/student/send-sms-to-selected-students";
import {
    IUpdateAgeAndGenderRequestModel
} from "src/app/shared/interfaces/dto/template-app/student/update-age-and-gender";
import {
    RetrieveFacultyListSearchPopupComponent
} from "src/app/private/admin/searchpopups/faculty/retrieve-faculty-list/retrieve-faculty-list-search-popup.component";
import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-student-list",
  imports: [CommonModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, RouterModule, FormsModule, RetrieveEmpLocationListSearchPopupComponent, RetrieveFacultyListSearchPopupComponent, NgbPaginationModule],
  templateUrl: "./retrieve-student-list.component.html",
  styleUrls: ["./retrieve-student-list.component.scss"],
  standalone: true
})
export class RetrieveStudentListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveStudentListSectionFields: any = [];
  retrieveStudentListSectionData: any = {};
  retrieveStudentListSelectOptionsData: any = {};

  isDeleteStudentsByIdsButtonDisabled = false;
  isUpdateStudentByIdsButtonDisabled = false;
  isSendSmsToSelectedStudentsButtonDisabled = false;
  sendSmsToSelectedStudentsSectionFields: any = [];
  sendSmsToSelectedStudentsSectionData: any = {};
  sendSmsToSelectedStudentsSelectOptionsData: any = {};
  isUpdateAgeAndGenderButtonDisabled = false;
  selectedStudentUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveStudentListSearchFilter = <
    retrieveStudentListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveStudentListDataObject[]> = new Map<
    number,
    retrieveStudentListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  isAllItemsCheckboxSelected: boolean = false;
  updateAgeAndGender_genderOptions: DropDownOption[] = OptionsList["Gender"];

  retrieveStudentList_classInfoList: any[];
  selected_retrieveStudentList_classInfoUUID: string;
  retrieveStudentList_sectionList: any[];
  selected_retrieveStudentList_sectionUUID: string;
  retrieveStudentList_dynamicLocationList: any[];
  selected_retrieveStudentList_dynamicLocationUUID: string;
  retrieveStudentList_staticLocationList: any[];
  selected_retrieveStudentList_staticLocationUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveStudentListTableColumns: Array<any> = [];
  isPaginationInitialized = false;
  @ViewChild("retrieveFacultyListSearchPopupCompRef")
  retrieveFacultyListSearchPopupCompRef!: RetrieveFacultyListSearchPopupComponent;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;

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
    this.retrieveStudentList_classInfoList = [];
    this.selected_retrieveStudentList_classInfoUUID = "";
    this.retrieveStudentList_sectionList = [];
    this.selected_retrieveStudentList_sectionUUID = "";
    this.retrieveStudentList_dynamicLocationList = [];
    this.selected_retrieveStudentList_dynamicLocationUUID = "";
    this.retrieveStudentList_staticLocationList = [];
    this.selected_retrieveStudentList_staticLocationUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("RetrieveStudentList");
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveStudentListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStudentList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveStudentList",
      retrieveStudentListResponseParamList,
      this
    );
    //Load page fields
    let retrieveStudentListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveStudentList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveStudentList",
        retrieveStudentListRequestParamList,
        this
      );

    let sendSmsToSelectedStudentsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "sendSmsToSelectedStudents",
        this.backendService,
        this.toastNotificationService
      );
    this.sendSmsToSelectedStudentsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "sendSmsToSelectedStudents",
        sendSmsToSelectedStudentsRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "retrieveStudentList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit("retrieveStudentList", this.currentRoute, this, [
      "retrieveStudentListSC",
    ]);
  }

  async resetSearchCriteria() {
    this.retrieveStudentListSectionData = {};
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
      this.retrieveStudentListSectionData["firstName"];
    this.searchFilter.lastName =
      this.retrieveStudentListSectionData["lastName"];
    this.searchFilter.classInfoUUID =
      this.retrieveStudentListSectionData["classInfoUUID"];
    this.searchFilter.sectionUUID =
      this.retrieveStudentListSectionData["sectionUUID"];
    this.searchFilter.gender = this.retrieveStudentListSectionData["gender"];
    this.searchFilter.isAccountActive =
      this.retrieveStudentListSectionData["isAccountActive"];
    this.searchFilter.dateOfBirthFrom =
      this.retrieveStudentListSectionData["dateOfBirthFrom"];
    this.searchFilter.dateOfBirthTo =
      this.retrieveStudentListSectionData["dateOfBirthTo"];
    this.searchFilter.dynamicLocationUUID =
      this.retrieveStudentListSectionData["dynamicLocationUUID"];
    this.searchFilter.staticLocationUUID =
      this.retrieveStudentListSectionData["staticLocationUUID"];
    this.searchFilter.location1UUID =
      this.retrieveStudentListSectionData["location1UUID"];
    this.searchFilter.age = this.retrieveStudentListSectionData["age"];
    this.searchFilter.percentage =
      this.retrieveStudentListSectionData["percentage"];
    this.searchFilter.collegeId =
      this.retrieveStudentListSectionData["collegeId"];
    this.searchFilter.dateTimeField =
      this.retrieveStudentListSectionData["dateTimeField"];
    this.searchFilter.dateTimeWithSecondsField =
      this.retrieveStudentListSectionData["dateTimeWithSecondsField"];
    this.searchFilter.timeField =
      this.retrieveStudentListSectionData["timeField"];
    this.searchFilter.timeWithSecondsField =
      this.retrieveStudentListSectionData["timeWithSecondsField"];
    this.searchFilter.isPassed =
      this.retrieveStudentListSectionData["isPassed"];
    this.searchFilter.passMarks =
      this.retrieveStudentListSectionData["passMarks"];
    this.searchFilter.failMarks =
      this.retrieveStudentListSectionData["failMarks"];
    this.searchFilter.grade = this.retrieveStudentListSectionData["grade"];
    this.searchFilter.gradeAMarks =
      this.retrieveStudentListSectionData["gradeAMarks"];
    this.searchFilter.gradeBMarks =
      this.retrieveStudentListSectionData["gradeBMarks"];
    this.searchFilter.gradeCMarks =
      this.retrieveStudentListSectionData["gradeCMarks"];
    let numberFieldList: any[] = [];
    numberFieldList.push({
      key: "age",
      label: "Age",
      conditionType: "Positive",
    });
    numberFieldList.push({
      key: "percentage",
      label: "Percentage",
      conditionType: "PositiveOrZero",
    });
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
      await this.backendService.retrieveStudentList(this.searchFilter)
    );
    if (searchResponse.success == 0) {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }
    if (searchResponse.alert) {
      this.toastNotificationService.showSuccess(searchResponse.alert);
    } else {
      this.searchResultObjectsList = searchResponse.list;
      this.searchResultObjectsList =
        this.updateListApiDataWithInjectedFieldsData(
          this.searchResultObjectsList,
          this.toastNotificationService
        );
      this.collectionSize = searchResponse.matchingSearchResultsCount;
      this.noOfPages = searchResponse.totalPages;
      this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
    }
  }

  async openDeleteStudentsByIdsPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "delete-students-by-ids-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }
  async openUpdateStudentByIdsPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-student-by-ids-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }
  async openSendSmsToSelectedStudentsPopup(modal: any) {
    this.sendSmsToSelectedStudentsSectionData = {};
    let sendSmsToSelectedStudentsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "sendSmsToSelectedStudents",
        this.backendService,
        this.toastNotificationService
      );
    this.sendSmsToSelectedStudentsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "sendSmsToSelectedStudents",
        sendSmsToSelectedStudentsRequestParamList,
        this
      );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "send-sms-to-selected-students-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.sendSmsToSelectedStudentsSectionFields = [];
        },
        (reason) => {
          this.sendSmsToSelectedStudentsSectionFields = [];
        }
      );
  }
  async openUpdateAgeAndGenderPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-age-and-gender-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }

  async deleteStudentsByIds(modal: any) {
    this.isDeleteStudentsByIdsButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if (ids == null || ids.length == 0) {
      this.isDeleteStudentsByIdsButtonDisabled = false;
      this.toastNotificationService.showError(
        "Select atleast one line item to process the request."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.deleteStudentsByIds(ids);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isDeleteStudentsByIdsButtonDisabled = false;
  }
  async updateStudentByIds(modal: any) {
    this.isUpdateStudentByIdsButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if (ids == null || ids.length == 0) {
      this.isUpdateStudentByIdsButtonDisabled = false;
      this.toastNotificationService.showError(
        "Select atleast one line item to process the request."
      );
      return;
    }
    const updateStudentByIdsRequestModel: IUpdateStudentByIdsRequestModel = {
      ids: [],
    };
    updateStudentByIdsRequestModel["ids"] = ids;
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      updateStudentByIdsRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateStudentByIdsButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.updateStudentByIds(
        updateStudentByIdsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateStudentByIdsButtonDisabled = false;
  }
  async sendSmsToSelectedStudents(modal: any) {
    this.isSendSmsToSelectedStudentsButtonDisabled = true;
    let ids = this.getSelectedLineItemIds();
    if (ids == null || ids.length == 0) {
      this.isSendSmsToSelectedStudentsButtonDisabled = false;
      this.toastNotificationService.showError(
        "Select atleast one line item to process the request."
      );
      return;
    }
    const sendSmsToSelectedStudentsRequestModel: ISendSmsToSelectedStudentsRequestModel =
      {
        ids: [],
        location1UUID:
          this.sendSmsToSelectedStudentsSectionData["location1UUID"],
        faculty1UUID: this.sendSmsToSelectedStudentsSectionData["faculty1UUID"],
        message: this.sendSmsToSelectedStudentsSectionData["message"],
        isPassed: this.getBooleanParameterValue(
          this.sendSmsToSelectedStudentsSectionData["isPassed"]
        ),
        passMarks: this.sendSmsToSelectedStudentsSectionData["passMarks"],
        failMarks: this.sendSmsToSelectedStudentsSectionData["failMarks"],
        grade: this.getComboParameterValue(
          this.sendSmsToSelectedStudentsSectionData["grade"]
        ),
        gradeAMarks: this.sendSmsToSelectedStudentsSectionData["gradeAMarks"],
        gradeBMarks: this.sendSmsToSelectedStudentsSectionData["gradeBMarks"],
        gradeCMarks: this.sendSmsToSelectedStudentsSectionData["gradeCMarks"],
      };
    sendSmsToSelectedStudentsRequestModel["ids"] = ids;
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      sendSmsToSelectedStudentsRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isSendSmsToSelectedStudentsButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.sendSmsToSelectedStudents(
        sendSmsToSelectedStudentsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isSendSmsToSelectedStudentsButtonDisabled = false;
  }
  async updateAgeAndGender(modal: any) {
    this.isUpdateAgeAndGenderButtonDisabled = true;
    let list: Array<any> = [];
    let isValidData: boolean = true;
    let invalidRowNos = "";
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      let isSelected = this.searchResultObjectsList[i].isSelected;
      if (isSelected) {
        let studentUUID = this.searchResultObjectsList[i].studentUUID;
        let validRowData = true;
        let age: any = this.searchResultObjectsList[i].ageForUpdate;
        if (age == null || age.length == 0) {
          validRowData = false;
        }
        let gender: any = this.searchResultObjectsList[i].genderForUpdate;
        if (gender == null || gender.length == 0) {
          validRowData = false;
        }
        if (!validRowData) {
          invalidRowNos = invalidRowNos + (i + 1) + ",";
          isValidData = false;
        }
        list.push({
          studentUUID: studentUUID,
          age: age,
          gender: gender,
        });
      }
    }
    if (!isValidData) {
      this.isUpdateAgeAndGenderButtonDisabled = false;
      if (invalidRowNos.length > 0) {
        invalidRowNos = invalidRowNos.substring(0, invalidRowNos.length - 1);
      }
      this.toastNotificationService.showError(
        " Data missing for selected records at row nos : '" +
          invalidRowNos +
          "'. Enter the missing data and try again."
      );
      return;
    }
    if (list == null || list.length == 0) {
      this.isUpdateAgeAndGenderButtonDisabled = false;
      this.toastNotificationService.showError(
        "Select atleast one line item to process the request."
      );
      return;
    }
    const updateAgeAndGenderRequestModel: IUpdateAgeAndGenderRequestModel = {
      list: [],
    };
    updateAgeAndGenderRequestModel["list"] = list;
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      updateAgeAndGenderRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateAgeAndGenderButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.updateAgeAndGender(
        updateAgeAndGenderRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.search();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateAgeAndGenderButtonDisabled = false;
  }
  getSelectedLineItemIds() {
    let idsList: any = [];
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      let isSelected = this.searchResultObjectsList[i].isSelected;
      if (isSelected) {
        let selectedId = this.searchResultObjectsList[i].studentUUID;
        idsList.push(selectedId);
      }
    }
    return idsList;
  }
  toggleAllItemsSelectionCheckbox() {
    for (let i = 0; i < this.searchResultObjectsList.length; i++) {
      this.searchResultObjectsList[i].isSelected =
        !this.isAllItemsCheckboxSelected;
    }
  }
  executeUserAction(actionName: any, dataObject: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveStudentList",
      this.router,
      dataObject,
      this.backendService,
      this.toastNotificationService
    );
  }
  openSearchPopupInParent(event: any) {
    var fieldKey = event.fieldKey;
    var sectionName = event.sectionName;
    if (sectionName) {
      sectionName = this.toInitLower(sectionName);
    }
    this.openSearchPopup(fieldKey, sectionName);
  }
  openSearchPopup(fieldName: string, sectionName: string) {
    if (1 > 2) {
    } else if (
      fieldName == "location1UUID" &&
      sectionName == "retrieveStudentList"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "retrieveStudentList",
        fieldName
      );
    } else if (fieldName == "location1UUID") {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "sendSmsToSelectedStudents",
        fieldName
      );
    } else if (fieldName == "faculty1UUID") {
      this.retrieveFacultyListSearchPopupCompRef.showRetrieveFacultyListSearchPopup(
        "sendSmsToSelectedStudents",
        fieldName
      );
    }
  }

  setSearchPopupValue(selectedLookupData: any) {
    let processingSectionName = selectedLookupData["processingSectionName"];
    let processingFieldName = selectedLookupData["processingFieldName"];
    let dataObject: any = {};
    dataObject[processingFieldName] = selectedLookupData["id"];
    this.setSelectedSearchPopupData(
      processingFieldName,
      processingSectionName,
      dataObject,
      selectedLookupData["displayText"]
    );
  }
  setSelectedSearchPopupData(
    processingFieldName: string,
    processingSectionName: any,
    dataObject: any,
    displayText: string
  ) {
    if (1 > 2) {
    } else if (processingSectionName == "retrieveStudentList") {
      this.retrieveStudentListSectionData[processingFieldName] =
        dataObject[processingFieldName];
      document
        .getElementById("retrieve-student-list-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "sendSmsToSelectedStudents") {
      this.sendSmsToSelectedStudentsSectionData[processingFieldName] =
        dataObject[processingFieldName];
      document
        .getElementById("send-sms-to-selected-students-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
    if (
      field.key == "classInfoUUID" &&
      field.apiName == "retrieveStudentList"
    ) {
      let sectionDataObjectList: any = [this.retrieveStudentListSectionData];
      this.resetDependentLookupFieldsData(sectionDataObjectList, [
        "sectionUUID",
      ]);
    }
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "retrieveStudentList")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["retrieveStudentList"]
      );
    if (field.apiName === "sendSmsToSelectedStudents")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["sendSmsToSelectedStudents"]
      );
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveStudentListSC",
    ]);
  }

  updateSelectOptionsData() {
    this.retrieveStudentListSelectOptionsData["gender"] = OptionsList.Gender;
    this.retrieveStudentListSelectOptionsData["grade"] = OptionsList.Grade;

    this.sendSmsToSelectedStudentsSelectOptionsData["grade"] =
      OptionsList.Grade;
  }
}
