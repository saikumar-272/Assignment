import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule} from "@angular/forms";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {Constants} from "src/app/shared/util/constants";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
import {validateAttachmentSize} from "src/app/shared/util/form-validators";
//User Actions request model
import {
    IUpdateStudentAllDetailsRequestModel
} from "src/app/shared/interfaces/dto/template-app/student/update-student-all-details";
import {
    IUpdateStudentFirstNameRequestModel
} from "src/app/shared/interfaces/dto/template-app/student/update-student-first-name";
import {IMakeFeePaymentRequestModel} from "src/app/shared/interfaces/dto/template-app/student/make-fee-payment";

import {
    RetrieveFacultyListSearchPopupComponent
} from "src/app/private/admin/searchpopups/faculty/retrieve-faculty-list/retrieve-faculty-list-search-popup.component";
import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {isBlank,} from "src/app/shared/util/string-util";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {of} from "rxjs";

@Component({
selector: "app-retrieve-student",
  imports: [CommonModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RouterModule, FormsModule, RetrieveEmpLocationListSearchPopupComponent, RetrieveFacultyListSearchPopupComponent, NgbModule],
  templateUrl: "./retrieve-student.component.html",
  styleUrls: ["./retrieve-student.component.scss"],
  standalone: true
})
export class RetrieveStudentComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Retrieve Student";
  userActions: Array<any> = [];
  section1FieldList: Array<any> = [];
  section2FieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params
  isUpdateStudentAllDetailsButtonDisabled = false;
  isUpdateStudentAllDetailsEnabled = true;
  updateStudentAllDetailsForm = new FormGroup({});
  updateStudentAllDetailsModel: any = {};
  updateStudentAllDetailsFields: FormlyFieldConfig[] = [];
  updateStudentAllDetailsLookupDisplayTextMap: any = {};

  updateStudentAllDetailsSectionFields: any = [];
  updateStudentAllDetailsSectionData: any = {};
  updateStudentAllDetailsSelectOptionsData: any = {};
  updateStudentAllDetailsSelectedLookupsDataListObj: any = {};
  isUpdateStudentFirstNameButtonDisabled = false;
  isUpdateStudentFirstNameEnabled = true;
  updateStudentFirstNameForm = new FormGroup({});
  updateStudentFirstNameModel: any = {};
  updateStudentFirstNameFields: FormlyFieldConfig[] = [];
  updateStudentFirstNameLookupDisplayTextMap: any = {};

  updateStudentFirstNameSectionFields: any = [];
  updateStudentFirstNameSectionData: any = {};
  updateStudentFirstNameSelectOptionsData: any = {};
  updateStudentFirstNameSelectedLookupsDataListObj: any = {};
  isUpdateStudentFirstName2ButtonDisabled = false;
  isUpdateStudentFirstName2Enabled = true;
  updateStudentFirstName2Form = new FormGroup({});
  updateStudentFirstName2Model: any = {};
  updateStudentFirstName2Fields: FormlyFieldConfig[] = [];
  updateStudentFirstName2LookupDisplayTextMap: any = {};

  updateStudentFirstName2SectionFields: any = [];
  updateStudentFirstName2SectionData: any = {};
  updateStudentFirstName2SelectOptionsData: any = {};
  updateStudentFirstName2SelectedLookupsDataListObj: any = {};
  isAssignToFacultyButtonDisabled = false;
  isAssignToFacultyEnabled = true;
  assignToFacultyForm = new FormGroup({});
  assignToFacultyModel: any = {};
  assignToFacultyFields: FormlyFieldConfig[] = [];
  assignToFacultyLookupDisplayTextMap: any = {};

  assignToFacultySectionFields: any = [];
  assignToFacultySectionData: any = {};
  assignToFacultySelectOptionsData: any = {};
  assignToFacultySelectedLookupsDataListObj: any = {};
  isRemoveFromFacultyButtonDisabled = false;
  isRemoveFromFacultyEnabled = true;
  isMakeFeePaymentButtonDisabled = false;
  isMakeFeePaymentEnabled = true;
  makeFeePaymentForm = new FormGroup({});
  makeFeePaymentModel: any = {};
  makeFeePaymentFields: FormlyFieldConfig[] = [];
  makeFeePaymentLookupDisplayTextMap: any = {};

  makeFeePaymentSectionFields: any = [];
  makeFeePaymentSectionData: any = {};
  makeFeePaymentSelectOptionsData: any = {};
  makeFeePaymentSelectedLookupsDataListObj: any = {};

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
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private timeZoneService: TimeZoneService
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
    if (!(this.selectedStudentUUID && this.selectedStudentUUID.length > 0)) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveStudent(
      this.selectedStudentUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveStudent",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveStudent");

    //Load page fields
    let retrieveStudentResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStudent",
        this.backendService,
        this.toastNotificationService
      );
    this.section1FieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveStudent",
      "Section1",
      retrieveStudentResponseParamList,
      this.additionalProperties
    );
    this.section2FieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveStudent",
      "Section2",
      retrieveStudentResponseParamList,
      this.additionalProperties
    );
    this.doAfterPageDataLoaded(
      "retrieveStudent",
      this.currentRoute,
      this,
      this.retrievedDataObject
    );
    this.retrievedDataObject =
      this.updateRetrieveApiDataObjectWithInjectedFieldsData(
        this.retrievedDataObject,
        this.toastNotificationService
      );
    this.modifyData(
      "retrieveStudent",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
    let updateStudentAllDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateStudentAllDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.updateStudentAllDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateStudentAllDetails",
        updateStudentAllDetailsRequestParamList,
        this
      );
    let updateStudentFirstNameRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateStudentFirstName",
        this.backendService,
        this.toastNotificationService
      );
    this.updateStudentFirstNameSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateStudentFirstName",
        updateStudentFirstNameRequestParamList,
        this
      );
    let updateStudentFirstName2RequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateStudentFirstName2",
        this.backendService,
        this.toastNotificationService
      );
    this.updateStudentFirstName2SectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateStudentFirstName2",
        updateStudentFirstName2RequestParamList,
        this
      );
    let assignToFacultyRequestParamList =
      await this.getApiRequestParameterListCustom(
        "assignToFaculty",
        this.backendService,
        this.toastNotificationService
      );
    this.assignToFacultySectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "assignToFaculty",
        assignToFacultyRequestParamList,
        this
      );
    let makeFeePaymentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "makeFeePayment",
        this.backendService,
        this.toastNotificationService
      );
    this.makeFeePaymentSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "makeFeePayment",
        makeFeePaymentRequestParamList,
        this
      );

    setTimeout(() => {
      this.updateDisplayPropertyOfApiParameterDependentFields(
        "retrieveStudent",
        this.retrievedDataObject,
        this.pageSectionNameList,
        this
      );
    }, 100);
  }

  //Start User actions
  async openUpdateStudentAllDetailsPopup(modal: any) {
    this.updateStudentAllDetailsSectionFields = [];
    this.updateStudentAllDetailsSectionData = {};
    let updateStudentAllDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateStudentAllDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.updateStudentAllDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateStudentAllDetails",
        updateStudentAllDetailsRequestParamList,
        this
      );
    this.setUpdateStudentAllDetailsSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateStudentAllDetailsLookupDisplayTextMap = {};
    this.updateDisplayPropertyOfApiParameterDependentFields(
      "updateStudentAllDetails",
      this.retrievedDataObject,
      ["updateStudentAllDetails"],
      this
    );
    setTimeout(() => {
      this.updateStudentAllDetailsSectionData = { ...this.retrievedDataObject };
      this.updateStudentAllDetailsForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-student-all-details-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateStudentAllDetailsForm.reset();
        },
        (reason) => {
          this.updateStudentAllDetailsForm.reset();
        }
      );
  }
  async openUpdateStudentFirstNamePopup(modal: any) {
    this.updateStudentFirstNameSectionFields = [];
    this.updateStudentFirstNameSectionData = {};
    let updateStudentFirstNameRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateStudentFirstName",
        this.backendService,
        this.toastNotificationService
      );
    this.updateStudentFirstNameSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateStudentFirstName",
        updateStudentFirstNameRequestParamList,
        this
      );
    this.setUpdateStudentFirstNameSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateStudentFirstNameLookupDisplayTextMap = {};
    this.updateStudentFirstNameLookupDisplayTextMap["location1UUID"] = isBlank(
      this.retrievedDataObject["location1UUID"]
    )
      ? ""
      : this.retrievedDataObject["location1DisplayText"];
    setTimeout(() => {
      this.updateStudentFirstNameSectionData = { ...this.retrievedDataObject };
      this.updateStudentFirstNameForm.patchValue(this.retrievedDataObject);
      document
        .getElementById("update-student-first-name-modal-body")
        ?.querySelector("#location1UUID")
        ?.setAttribute(
          "value",
          this.updateStudentFirstNameLookupDisplayTextMap["location1UUID"]
        );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-student-first-name-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateStudentFirstNameForm.reset();
        },
        (reason) => {
          this.updateStudentFirstNameForm.reset();
        }
      );
  }
  async openUpdateStudentFirstName2Popup(modal: any) {
    this.updateStudentFirstName2SectionFields = [];
    this.updateStudentFirstName2SectionData = {};
    let updateStudentFirstName2RequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateStudentFirstName2",
        this.backendService,
        this.toastNotificationService
      );
    this.updateStudentFirstName2SectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateStudentFirstName2",
        updateStudentFirstName2RequestParamList,
        this
      );
    this.setUpdateStudentFirstName2SelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateStudentFirstName2LookupDisplayTextMap = {};
    this.updateStudentFirstName2LookupDisplayTextMap["faculty1UUID"] = isBlank(
      this.retrievedDataObject["faculty1UUID"]
    )
      ? ""
      : this.retrievedDataObject["faculty1DisplayText"];
    setTimeout(() => {
      this.updateStudentFirstName2SectionData = { ...this.retrievedDataObject };
      this.updateStudentFirstName2Form.patchValue(this.retrievedDataObject);
      document
        .getElementById("update-student-first-name2-modal-body")
        ?.querySelector("#faculty1UUID")
        ?.setAttribute(
          "value",
          this.updateStudentFirstName2LookupDisplayTextMap["faculty1UUID"]
        );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-student-first-name2-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateStudentFirstName2Form.reset();
        },
        (reason) => {
          this.updateStudentFirstName2Form.reset();
        }
      );
  }
  async openAssignToFacultyPopup(modal: any) {
    this.assignToFacultySectionFields = [];
    this.assignToFacultySectionData = {};
    let assignToFacultyRequestParamList =
      await this.getApiRequestParameterListCustom(
        "assignToFaculty",
        this.backendService,
        this.toastNotificationService
      );
    this.assignToFacultySectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "assignToFaculty",
        assignToFacultyRequestParamList,
        this
      );
    this.setAssignToFacultySelectedLookupsDataIntoObj(this.retrievedDataObject);
    this.assignToFacultyLookupDisplayTextMap = {};
    setTimeout(() => {
      this.assignToFacultySectionData = { ...this.retrievedDataObject };
      this.assignToFacultyForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "assign-to-faculty-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.assignToFacultyForm.reset();
        },
        (reason) => {
          this.assignToFacultyForm.reset();
        }
      );
  }
  async openRemoveFromFacultyPopup(modal: any) {
    this.modalService
      .open(modal, {
        ariaLabelledBy: "remove-from-faculty-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {},
        (reason) => {}
      );
  }
  async openMakeFeePaymentPopup(modal: any) {
    this.makeFeePaymentSectionFields = [];
    this.makeFeePaymentSectionData = {};
    let makeFeePaymentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "makeFeePayment",
        this.backendService,
        this.toastNotificationService
      );
    this.makeFeePaymentSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "makeFeePayment",
        makeFeePaymentRequestParamList,
        this
      );
    this.setMakeFeePaymentSelectedLookupsDataIntoObj(this.retrievedDataObject);
    this.makeFeePaymentLookupDisplayTextMap = {};
    setTimeout(() => {
      this.makeFeePaymentSectionData = { ...this.retrievedDataObject };
      this.makeFeePaymentForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "make-fee-payment-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.makeFeePaymentForm.reset();
        },
        (reason) => {
          this.makeFeePaymentForm.reset();
        }
      );
  }

  async updateStudentAllDetails(modal: any) {
    this.isUpdateStudentAllDetailsButtonDisabled = true;
    const updateStudentAllDetailsRequestModel: IUpdateStudentAllDetailsRequestModel =
      {
        firstName: this.updateStudentAllDetailsSectionData["firstName"],
        lastName: this.updateStudentAllDetailsSectionData["lastName"],
        gender: this.getComboParameterValue(
          this.updateStudentAllDetailsSectionData["gender"]
        ),
        isAccountActive: this.getBooleanParameterValue(
          this.updateStudentAllDetailsSectionData["isAccountActive"]
        ),
        dateOfBirth: this.updateStudentAllDetailsSectionData["dateOfBirth"],
        staticLocationUUID:
          this.updateStudentAllDetailsSectionData["staticLocationUUID"],
        dynamicLocationUUID:
          this.updateStudentAllDetailsSectionData["dynamicLocationUUID"],
        profilePicture:
          this.updateStudentAllDetailsSectionData["profilePicture"],
        age: this.updateStudentAllDetailsSectionData["age"],
        percentage: this.updateStudentAllDetailsSectionData["percentage"],
        collegeId: this.updateStudentAllDetailsSectionData["collegeId"],
        dateTimeField: this.updateStudentAllDetailsSectionData["dateTimeField"],
        dateTimeWithSecondsField:
          this.updateStudentAllDetailsSectionData["dateTimeWithSecondsField"],
        timeField: this.updateStudentAllDetailsSectionData["timeField"],
        timeWithSecondsField:
          this.updateStudentAllDetailsSectionData["timeWithSecondsField"],
        isPassed: this.getBooleanParameterValue(
          this.updateStudentAllDetailsSectionData["isPassed"]
        ),
        passMarks: this.updateStudentAllDetailsSectionData["passMarks"],
        failMarks: this.updateStudentAllDetailsSectionData["failMarks"],
        grade: this.getComboParameterValue(
          this.updateStudentAllDetailsSectionData["grade"]
        ),
        gradeAMarks: this.updateStudentAllDetailsSectionData["gradeAMarks"],
        gradeBMarks: this.updateStudentAllDetailsSectionData["gradeBMarks"],
        gradeCMarks: this.updateStudentAllDetailsSectionData["gradeCMarks"],
        studentUUID: this.selectedStudentUUID,
      };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Profile Picture",
      updateStudentAllDetailsRequestModel.profilePicture,
      1
    );
    if (errorMessage.length > 0) {
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
      updateStudentAllDetailsRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateStudentAllDetailsButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.updateStudentAllDetails(
        updateStudentAllDetailsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateStudentAllDetails",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateStudentAllDetailsButtonDisabled = false;
  }
  async updateStudentFirstName(modal: any) {
    this.isUpdateStudentFirstNameButtonDisabled = true;
    const updateStudentFirstNameRequestModel: IUpdateStudentFirstNameRequestModel =
      {
        firstName: this.updateStudentFirstNameSectionData["firstName"],
        location1UUID: this.updateStudentFirstNameSectionData["location1UUID"],
        studentUUID: this.selectedStudentUUID,
      };
    const response: IResponseMessage =
      await this.backendService.updateStudentFirstName(
        updateStudentFirstNameRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateStudentFirstName",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateStudentFirstNameButtonDisabled = false;
  }
  async updateStudentFirstName2(modal: any) {
    this.isUpdateStudentFirstName2ButtonDisabled = true;
    const studentUUID = this.selectedStudentUUID;
    const firstName = this.updateStudentFirstName2SectionData["firstName"];
    const faculty1UUID =
      this.updateStudentFirstName2SectionData["faculty1UUID"];
    const response: IResponseMessage =
      await this.backendService.updateStudentFirstName2(
        studentUUID,
        firstName,
        faculty1UUID
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateStudentFirstName2",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateStudentFirstName2ButtonDisabled = false;
  }
  async assignToFaculty(modal: any) {
    this.isAssignToFacultyButtonDisabled = true;
    const studentUUID = this.selectedStudentUUID;
    const facultyUUID = this.assignToFacultySectionData["facultyUUID"];
    const response: IResponseMessage =
      await this.backendService.assignToFaculty(facultyUUID, studentUUID);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "AssignToFaculty",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isAssignToFacultyButtonDisabled = false;
  }
  async removeFromFaculty(modal: any) {
    this.isRemoveFromFacultyButtonDisabled = true;
    const studentUUID = this.selectedStudentUUID;
    const response: IResponseMessage =
      await this.backendService.removeFromFaculty(studentUUID);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "RemoveFromFaculty",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isRemoveFromFacultyButtonDisabled = false;
  }
  async makeFeePayment(modal: any) {
    this.isMakeFeePaymentButtonDisabled = true;
    const makeFeePaymentRequestModel: IMakeFeePaymentRequestModel = {
      amount: this.makeFeePaymentSectionData["amount"],
      studentUUID: this.selectedStudentUUID,
    };
    const response: IResponseMessage = await this.backendService.makeFeePayment(
      makeFeePaymentRequestModel
    );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "MakeFeePayment",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isMakeFeePaymentButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(actionName, "RetrieveStudent", this.router, {
      id: this.selectedStudentUUID,
    });
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
    }
    //User actions
    else if (
      fieldName == "location1UUID" &&
      sectionName == "updateStudentFirstName"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "updateStudentFirstName",
        fieldName
      );
    } else if (
      fieldName == "faculty1UUID" &&
      sectionName == "updateStudentFirstName2"
    ) {
      this.retrieveFacultyListSearchPopupCompRef.showRetrieveFacultyListSearchPopup(
        "updateStudentFirstName2",
        fieldName
      );
    }
  }

  setSearchPopupValue(selectedLookupData: any) {
    let processingSectionName = selectedLookupData["processingSectionName"];
    let processingFieldName = selectedLookupData["processingFieldName"];
    let dataObject: any = {};
    dataObject[processingFieldName] = selectedLookupData["id"];
    this.setSelectedSearchPopupDataToSectionForm(
      processingFieldName,
      processingSectionName,
      dataObject,
      selectedLookupData["displayText"]
    );
  }
  setSelectedSearchPopupDataToSectionForm(
    processingFieldName: string,
    processingSectionName: any,
    dataObject: any,
    displayText: string
  ) {
    if (1 > 2) {
    } else if (processingSectionName == "updateStudentAllDetails") {
      this.updateStudentAllDetailsForm.patchValue(dataObject);
      this.updateStudentAllDetailsLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-student-all-details-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-student-all-details-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateStudentFirstName") {
      this.updateStudentFirstNameForm.patchValue(dataObject);
      this.updateStudentFirstNameLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-student-first-name-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-student-first-name-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateStudentFirstName2") {
      this.updateStudentFirstName2Form.patchValue(dataObject);
      this.updateStudentFirstName2LookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-student-first-name2-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-student-first-name2-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "assignToFaculty") {
      this.assignToFacultyForm.patchValue(dataObject);
      this.assignToFacultyLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("assign-to-faculty-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("assign-to-faculty-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "makeFeePayment") {
      this.makeFeePaymentForm.patchValue(dataObject);
      this.makeFeePaymentLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("make-fee-payment-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("make-fee-payment-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    }
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateStudentAllDetails")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["updateStudentAllDetails"]
      );
  }
  async allowPublicAccess(attachmentUUID: string) {
    const response: IResponseMessage =
      await this.backendService.allowPublicAccess(attachmentUUID, "student");
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      this.toastNotificationService.showSuccess(response.alert);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      this.toastNotificationService.showError(response.alert);
    }
  }
  async disablePublicAccess(attachmentUUID: string) {
    const response: IResponseMessage =
      await this.backendService.disablePublicAccess(attachmentUUID, "student");
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      this.toastNotificationService.showSuccess(response.alert);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      this.toastNotificationService.showError(response.alert);
    }
  }
  showUserActions(): boolean {
    return (
      this.doesUserHaveAccess("UpdateStudentAllDetails") ||
      this.doesUserHaveAccess("UpdateStudentFirstName") ||
      this.doesUserHaveAccess("UpdateStudentFirstName2") ||
      this.doesUserHaveAccess("AssignToFaculty") ||
      this.doesUserHaveAccess("RemoveFromFaculty") ||
      this.doesUserHaveAccess("MakeFeePayment") ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData() {
    this.updateStudentAllDetailsSelectOptionsData["gender"] =
      OptionsList.Gender;
    this.updateStudentAllDetailsSelectOptionsData["grade"] = OptionsList.Grade;
  }
  setUpdateStudentAllDetailsSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {
    if (!isBlank(retrievedObjectInfo["staticLocationUUID"])) {
      this.updateStudentAllDetailsSelectedLookupsDataListObj[
        "staticLocationUUID"
      ] = of([
        {
          id: retrievedObjectInfo["staticLocationUUID"],
          value: retrievedObjectInfo["staticLocationDisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["dynamicLocationUUID"])) {
      this.updateStudentAllDetailsSelectedLookupsDataListObj[
        "dynamicLocationUUID"
      ] = of([
        {
          id: retrievedObjectInfo["dynamicLocationUUID"],
          value: retrievedObjectInfo["dynamicLocationDisplayText"],
        }]);
    }
  }
  setUpdateStudentFirstNameSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {
    if (!isBlank(retrievedObjectInfo["location1UUID"])) {
      this.updateStudentFirstNameSelectedLookupsDataListObj["location1UUID"] =
        of([
          {
            id: retrievedObjectInfo["location1UUID"],
            value: retrievedObjectInfo["location1DisplayText"],
          }]);
    }
  }
  setUpdateStudentFirstName2SelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {
    if (!isBlank(retrievedObjectInfo["faculty1UUID"])) {
      this.updateStudentFirstName2SelectedLookupsDataListObj["faculty1UUID"] =
        of([
          {
            id: retrievedObjectInfo["faculty1UUID"],
            value: retrievedObjectInfo["faculty1DisplayText"],
          }]);
    }
  }
  setAssignToFacultySelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["facultyUUID"])) {
      this.assignToFacultySelectedLookupsDataListObj["facultyUUID"] = of([
        {
          id: retrievedObjectInfo["facultyUUID"],
          value: retrievedObjectInfo["facultyDisplayText"],
        }]);
    }
  }
  setRemoveFromFacultySelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
  setMakeFeePaymentSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
}
