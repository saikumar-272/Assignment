import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {ICreateStudentRequestModel} from "src/app/shared/interfaces/dto/template-app/student/create-student";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";
import {validateAttachmentSize,} from "src/app/shared/util/form-validators";
import {DropDownOption} from "src/app/shared/interfaces/dropdown_option";


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

@Component({
selector: "app-create-student",
  imports: [CommonModule, AdminChildSectionFormComponent, RetrieveEmpLocationListSearchPopupComponent, RetrieveFacultyListSearchPopupComponent, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./create-student.component.html",
  styleUrls: ["./create-student.component.scss"],
  standalone: true
})
export class CreateStudentComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Create Student";
  pageErrors: any = [];
  isCreateStudentButtonDisabled = false;
  section1SectionFields: any = [];
  section1SectionData: any = {};
  section1SelectOptionsData: any = {};
  section2SectionFields: any = [];
  section2SectionData: any = {};
  section2SelectOptionsData: any = {};
  pageComponentReference: any;
  createStudentLookupDisplayTextMap: any = {};

  createStudent_classInfoList: any[];
  selected_createStudent_classInfoUUID: string;
  createStudent_sectionList: any[];
  selected_createStudent_sectionUUID: string;
  createStudent_genderOptions: DropDownOption[];
  createStudent_dynamicLocationList: any[];
  selected_createStudent_dynamicLocationUUID: string;
  createStudent_staticLocationList: any[];
  selected_createStudent_staticLocationUUID: string;
  createStudent_gradeOptions: DropDownOption[];
  sectionsShowHideInfo = {
    enableSection1Section: true,
    enableSection2Section: true,
  };
  yesNoOptions = YES_NO_OPTIONS;
  @ViewChild("retrieveFacultyListSearchPopupCompRef")
  retrieveFacultyListSearchPopupCompRef!: RetrieveFacultyListSearchPopupComponent;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["section1", "section2"];
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private currentRoute: ActivatedRoute
  ) {
    super();
    this.createStudent_classInfoList = [];
    this.selected_createStudent_classInfoUUID = "";
    this.createStudent_sectionList = [];
    this.selected_createStudent_sectionUUID = "";
    this.createStudent_dynamicLocationList = [];
    this.selected_createStudent_dynamicLocationUUID = "";
    this.createStudent_staticLocationList = [];
    this.selected_createStudent_staticLocationUUID = "";
    this.createStudent_genderOptions = [
      { id: "Male", value: "Male" },
      { id: "Female", value: "Female" },
      { id: "Other", value: "Other" }];
    this.createStudent_gradeOptions = [
      { id: "A", value: "A" },
      { id: "B", value: "B" },
      { id: "C", value: "C" }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createStudent",
      this.toastNotificationService,
      this.backendService
    );

    let createStudentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createStudent",
        this.backendService,
        this.toastNotificationService
      );
    this.section1SectionFields = this.getSectionFieldsFromApiRequestParams(
      "Section1",
      createStudentRequestParamList,
      this
    );
    this.section2SectionFields = this.getSectionFieldsFromApiRequestParams(
      "Section2",
      createStudentRequestParamList,
      this
    );
    this.setDataToFormOnload(
      "createStudent",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createStudent",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createStudent() {
    this.isCreateStudentButtonDisabled = true;
    this.resetFormErrors("createStudent");
    this.pageErrors = [];
    const requestModel: ICreateStudentRequestModel = {
      firstName: this.section1SectionData["firstName"],
      lastName: this.section1SectionData["lastName"],
      classInfoUUID: this.section1SectionData["classInfoUUID"],
      sectionUUID: this.section1SectionData["sectionUUID"],
      gender: this.getComboParameterValue(this.section1SectionData["gender"]),
      isAccountActive: this.getBooleanParameterValue(
        this.section1SectionData["isAccountActive"]
      ),
      dateOfBirth: this.section1SectionData["dateOfBirth"],
      dynamicLocationUUID: this.section1SectionData["dynamicLocationUUID"],
      staticLocationUUID: this.section1SectionData["staticLocationUUID"],
      location1UUID: this.section1SectionData["location1UUID"],
      faculty1UUID: this.section1SectionData["faculty1UUID"],
      isPassed: this.getBooleanParameterValue(
        this.section1SectionData["isPassed"]
      ),
      passMarks: this.section1SectionData["passMarks"],
      failMarks: this.section1SectionData["failMarks"],
      profilePicture: this.section2SectionData["profilePicture"],
      publicPic: this.section2SectionData["publicPic"],
      age: this.section2SectionData["age"],
      percentage: this.section2SectionData["percentage"],
      collegeId: this.section2SectionData["collegeId"],
      dateTimeField: this.section2SectionData["dateTimeField"],
      dateTimeWithSecondsField:
        this.section2SectionData["dateTimeWithSecondsField"],
      timeField: this.section2SectionData["timeField"],
      timeWithSecondsField: this.section2SectionData["timeWithSecondsField"],
      grade: this.getComboParameterValue(this.section2SectionData["grade"]),
      gradeAMarks: this.section2SectionData["gradeAMarks"],
      gradeBMarks: this.section2SectionData["gradeBMarks"],
      gradeCMarks: this.section2SectionData["gradeCMarks"],
    };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Profile Picture",
      requestModel.profilePicture,
      1
    );
    errorMessage += validateAttachmentSize(
      "Public Pic",
      requestModel.publicPic,
      1
    );
    if (errorMessage.length > 0) {
      this.isCreateStudentButtonDisabled = false;
      this.toastNotificationService.showError(
        errorMessage,
        "Attachment size is more for below fields."
      );
      return;
    }
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
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateStudentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    let injectedFieldsDataJsonText: string = "{}";
    injectedFieldsDataJsonText = this.getUpdatedInjectedFieldsDataJsonText(
      injectedFieldsDataJsonText,
      this.section1SectionFields,
      this.section1SectionData
    );
    injectedFieldsDataJsonText = this.getUpdatedInjectedFieldsDataJsonText(
      injectedFieldsDataJsonText,
      this.section2SectionFields,
      this.section2SectionData
    );
    requestModel.injectedFieldsDataJsonText = injectedFieldsDataJsonText;
    this.getUpdatedPayload(
      "createStudent",
      requestModel,
      this.section1SectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    this.getUpdatedPayload(
      "createStudent",
      requestModel,
      this.section2SectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createStudent(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.section1SectionFields = [];
      this.section2SectionFields = [];
      if (
        !this.doAfterSave(
          "createStudent",
          requestModel,
          entityCreateResponse,
          this,
          this.router,
          this.currentRoute,
          this.backendService,
          this.toastNotificationService
        )
      ) {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      this.router.navigate(["/in/retrieve-student"], {
        queryParams: { id: entityCreateResponse.uuid },
      });
    } else {
      if (
        entityCreateResponse.errors &&
        entityCreateResponse.errors.length > 0
      ) {
        if (
          entityCreateResponse.alert &&
          entityCreateResponse.alert.length > 0
        ) {
          toastErrorMessage = entityCreateResponse.alert;
        }
        this.toastNotificationService.showError(toastErrorMessage);
        this.pageErrors = this.getPageErrors(entityCreateResponse.errors);
        this.populateFieldLevelErrors(
          "createStudent",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateStudentButtonDisabled = false;
  }
  async onLookupValueSelected(
    selectedValue: any,
    field: any,
    selectedRecord: any
  ) {
    this.updateLookupDisplayTextMap(
      field["apiName"],
      field["key"],
      selectedRecord?.value
    );
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
    if (field.key == "classInfoUUID" && field.apiName == "createStudent") {
      let sectionDataObjectList: any = [
        this.section1SectionData,
        this.section2SectionData];
      this.resetDependentLookupFieldsData(sectionDataObjectList, [
        "sectionUUID"]);
    }
  }
  updateLookupDisplayTextMap(
    fieldApiName: string,
    fieldKey: string,
    selectedValue: any
  ) {
    if (this.toInitLower(fieldApiName) === "createStudent")
      this.createStudentLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createStudent") {
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        this.pageSectionNameList
      );
    }
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(
      apiName,
      key,
      selectedValue,
      this,
      this.pageSectionNameList
    );
  }

  hideSectionField(key: string) {
    let apiFieldList = [
      ...this.section1SectionFields,
      ...this.section2SectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [
      ...this.section1SectionFields,
      ...this.section2SectionFields];
    this.displayAField(key, apiFieldList);
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
    } else if (fieldName == "location1UUID" && sectionName == "section1") {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "section1",
        fieldName
      );
    } else if (fieldName == "faculty1UUID" && sectionName == "section1") {
      this.retrieveFacultyListSearchPopupCompRef.showRetrieveFacultyListSearchPopup(
        "section1",
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
    } else if (processingSectionName == "section1") {
      this.section1SectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createStudentLookupDisplayTextMap[processingFieldName] = displayText;
      document
        .getElementById("create-student-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "section2") {
      this.section2SectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createStudentLookupDisplayTextMap[processingFieldName] = displayText;
      document
        .getElementById("create-student-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }

  updateSelectOptionsData() {
    this.section1SelectOptionsData["gender"] = OptionsList.Gender;
    this.section2SelectOptionsData["grade"] = OptionsList.Grade;
  }
}
