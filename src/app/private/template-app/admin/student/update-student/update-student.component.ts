import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {IUpdateStudentRequestModel} from "src/app/shared/interfaces/dto/template-app/student/update-student";
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";
import {validateAttachmentSize,} from "src/app/shared/util/form-validators";


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
import {isBlank,} from "src/app/shared/util/string-util";
import {of} from "rxjs";

@Component({
selector: "app-update-student",
  imports: [RouterModule, CommonModule, AdminChildSectionFormComponent, RetrieveFacultyListSearchPopupComponent, RetrieveEmpLocationListSearchPopupComponent, NgbModule, FormsModule, ReactiveFormsModule],

  templateUrl: "./update-student.component.html",
  styleUrls: ["./update-student.component.scss"],
  standalone: true
})
export class UpdateStudentComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Student";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateStudentButtonDisabled = false;
  section1SectionFields: any = [];
  section1SectionData: any = {};
  section1SelectOptionsData: any = {};
  section1SelectedLookupsDataListObj: any = {};
  section2SectionFields: any = [];
  section2SectionData: any = {};
  section2SelectOptionsData: any = {};
  section2SelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateStudentLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedStudentUUID: string = "";
  sectionsShowHideInfo = {
    enableSection1Section: true,
    enableSection2Section: true,
  };
  lineItemsSectionsShowHideInfo = {};
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
    private currentRoute: ActivatedRoute,
    private modalService: NgbModal,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.selectedStudentUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateStudent";
    if (this.selectedStudentUUID && this.selectedStudentUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveStudent(
        this.selectedStudentUUID
      );
      this.retrievedDataObject =
        this.updateRetrieveApiDataObjectWithInjectedFieldsData(
          this.retrievedDataObject,
          this.toastNotificationService
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateStudent",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateStudentRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateStudent",
          this.backendService,
          this.toastNotificationService
        );
      this.section1SectionFields = this.getSectionFieldsFromApiRequestParams(
        "Section1",
        updateStudentRequestParamList,
        this
      );
      this.section2SectionFields = this.getSectionFieldsFromApiRequestParams(
        "Section2",
        updateStudentRequestParamList,
        this
      );
      this.modifyData(
        "updateStudent",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      setTimeout(() => {
        this.updateDisplayPropertyOfApiParameterDependentFields(
          "updateStudent",
          this.retrievedDataObject,
          this.pageSectionNameList,
          this
        );
      }, 100);
    }
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.section1SectionData = retrievedObjectInfo;
      this.section2SectionData = retrievedObjectInfo;
      this.updateStudentLookupDisplayTextMap = {};
      this.updateStudentLookupDisplayTextMap["location1UUID"] = isBlank(
        retrievedObjectInfo["location1DisplayText"]
      )
        ? ""
        : retrievedObjectInfo["location1DisplayText"];
      document
        .getElementById("update-student-form")
        ?.querySelector("#location1UUID")
        ?.setAttribute(
          "value",
          this.updateStudentLookupDisplayTextMap["location1UUID"]
        );
      this.updateStudentLookupDisplayTextMap["faculty1UUID"] = isBlank(
        retrievedObjectInfo["faculty1DisplayText"]
      )
        ? ""
        : retrievedObjectInfo["faculty1DisplayText"];
      document
        .getElementById("update-student-form")
        ?.querySelector("#faculty1UUID")
        ?.setAttribute(
          "value",
          this.updateStudentLookupDisplayTextMap["faculty1UUID"]
        );
      this.doAfterPageDataLoaded(
        "updateStudent",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateStudent", this, retrievedObjectInfo);
    }, 100);
  }
  async updateStudent() {
    this.isUpdateStudentButtonDisabled = true;
    this.resetFormErrors("updateStudent");
    this.pageErrors = [];
    const requestModel: IUpdateStudentRequestModel = {
      studentUUID: this.selectedStudentUUID,
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
      this.isUpdateStudentButtonDisabled = false;
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
      this.isUpdateStudentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "updateStudent",
      requestModel,
      this.section1SectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    this.getUpdatedPayload(
      "updateStudent",
      requestModel,
      this.section2SectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateStudent(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateStudent",
          requestModel,
          entityUpdateResponse,
          this,
          this.router,
          this.currentRoute,
          this.backendService,
          this.toastNotificationService
        )
      ) {
        return;
      }
      window.location.reload();
    } else {
      if (
        entityUpdateResponse.errors &&
        entityUpdateResponse.errors.length > 0
      ) {
        if (
          entityUpdateResponse.alert &&
          entityUpdateResponse.alert.length > 0
        ) {
          toastErrorMessage = entityUpdateResponse.alert;
        }
        this.toastNotificationService.showError(toastErrorMessage);
        this.pageErrors = this.getPageErrors(entityUpdateResponse.errors);
        this.populateFieldLevelErrors(
          "updateStudent",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateStudentButtonDisabled = false;
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
    if (field.key == "classInfoUUID" && field.apiName == "updateStudent") {
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
    if (this.toInitLower(fieldApiName) === "updateStudent")
      this.updateStudentLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateStudent") {
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
      this.updateStudentLookupDisplayTextMap[processingFieldName] = displayText;
      document
        .getElementById("update-student-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "section2") {
      this.section2SectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateStudentLookupDisplayTextMap[processingFieldName] = displayText;
      document
        .getElementById("update-student-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }
  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["classInfoUUID"])) {
      this.section1SelectedLookupsDataListObj["classInfoUUID"] = of([
        {
          id: retrievedObjectInfo["classInfoUUID"],
          value: retrievedObjectInfo["classInfoDisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["sectionUUID"])) {
      this.section1SelectedLookupsDataListObj["sectionUUID"] = of([
        {
          id: retrievedObjectInfo["sectionUUID"],
          value: retrievedObjectInfo["sectionDisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["dynamicLocationUUID"])) {
      this.section1SelectedLookupsDataListObj["dynamicLocationUUID"] = of([
        {
          id: retrievedObjectInfo["dynamicLocationUUID"],
          value: retrievedObjectInfo["dynamicLocationDisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["staticLocationUUID"])) {
      this.section1SelectedLookupsDataListObj["staticLocationUUID"] = of([
        {
          id: retrievedObjectInfo["staticLocationUUID"],
          value: retrievedObjectInfo["staticLocationDisplayText"],
        }]);
    }
  }

  updateSelectOptionsData() {
    this.section1SelectOptionsData["gender"] = OptionsList.Gender;
    this.section2SelectOptionsData["grade"] = OptionsList.Grade;
  }
}
