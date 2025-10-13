import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {ICreateEmployeeRequestModel} from "src/app/shared/interfaces/dto/template-app/employee/create-employee";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";
import {validateAttachmentSize} from "src/app/shared/util/form-validators";
import {DropDownOption} from "src/app/shared/interfaces/dropdown_option";
import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-employee",
  templateUrl: "./create-employee.component.html",
  styleUrls: ["./create-employee.component.scss"],
  imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, RetrieveEmpLocationListSearchPopupComponent, NgbModule],
  standalone: true
})
export class CreateEmployeeComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Employee";
  pageErrors: any = [];
  isCreateEmployeeButtonDisabled = false;
  basicDetailsSectionFields: any = [];
  basicDetailsSectionData: any = {};
  basicDetailsSelectOptionsData: any = {};
  jobDetailsSectionFields: any = [];
  jobDetailsSectionData: any = {};
  jobDetailsSelectOptionsData: any = {};
  pageComponentReference: any;
  createEmployeeLookupDisplayTextMap: any = {};

  createEmployee_locationList: any[];
  selected_createEmployee_locationUUID: string;
  createEmployee_genderOptions: DropDownOption[];
  sectionsShowHideInfo = {
    enableBasicDetailsSection: true,
    enableJobDetailsSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["basicDetails", "jobDetails"];
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
    this.createEmployee_locationList = [];
    this.selected_createEmployee_locationUUID = "";
    this.createEmployee_genderOptions = [
      { id: "Male", value: "Male" },
      { id: "Female", value: "Female" },
      { id: "Other", value: "Other" }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createEmployee",
      this.toastNotificationService,
      this.backendService
    );

    let createEmployeeRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createEmployee",
        this.backendService,
        this.toastNotificationService
      );
    this.basicDetailsSectionFields = this.getSectionFieldsFromApiRequestParams(
      "BasicDetails",
      createEmployeeRequestParamList,
      this
    );
    this.jobDetailsSectionFields = this.getSectionFieldsFromApiRequestParams(
      "JobDetails",
      createEmployeeRequestParamList,
      this
    );
    this.updateDisplayPropertyOfSections(
      "createEmployee",
      "enableJobDetails",
      "",
      this.sectionsShowHideInfo
    );
    this.setDataToFormOnload(
      "createEmployee",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createEmployee",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createEmployee() {
    this.isCreateEmployeeButtonDisabled = true;
    this.resetFormErrors("createEmployee");
    this.pageErrors = [];
    const requestModel: ICreateEmployeeRequestModel = {
      firstName: this.basicDetailsSectionData["firstName"],
      enableJobDetails: this.getBooleanParameterValue(
        this.basicDetailsSectionData["enableJobDetails"]
      ),
      attachments: this.basicDetailsSectionData["attachments"],
      locationUUID: this.basicDetailsSectionData["locationUUID"],
      joininigDate: this.basicDetailsSectionData["joininigDate"],
      gender: this.getComboParameterValue(
        this.basicDetailsSectionData["gender"]
      ),
      dateTimeField: this.basicDetailsSectionData["dateTimeField"],
      dateTimeWithSecondsField:
        this.basicDetailsSectionData["dateTimeWithSecondsField"],
      timeField: this.basicDetailsSectionData["timeField"],
      timeWithSecondsField:
        this.basicDetailsSectionData["timeWithSecondsField"],
      location1UUID: this.basicDetailsSectionData["location1UUID"],
      skills: this.jobDetailsSectionData["skills"],
      location2UUID: this.jobDetailsSectionData["location2UUID"],
      noOfChildren: this.jobDetailsSectionData["noOfChildren"],
      salary: this.jobDetailsSectionData["salary"],
      hike: this.jobDetailsSectionData["hike"],
      objectId: this.jobDetailsSectionData["objectId"],
      isUserValidated: this.getBooleanParameterValue(
        this.jobDetailsSectionData["isUserValidated"]
      ),
    };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Attachments",
      requestModel.attachments,
      1
    );
    if (errorMessage.length > 0) {
      this.isCreateEmployeeButtonDisabled = false;
      this.toastNotificationService.showError(
        errorMessage,
        "Attachment size is more for below fields."
      );
      return;
    }
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateEmployeeButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createEmployee",
      requestModel,
      this.basicDetailsSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    this.getUpdatedPayload(
      "createEmployee",
      requestModel,
      this.jobDetailsSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createEmployee(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.basicDetailsSectionFields = [];
      this.jobDetailsSectionFields = [];
      if (
        !this.doAfterSave(
          "createEmployee",
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
      this.router.navigate(["/in/update-employee"], {
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
          "createEmployee",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateEmployeeButtonDisabled = false;
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
    if (true === field.showHideSections)
      this.updateDisplayPropertyOfSections(
        "createEmployee",
        field.key,
        selectedValue,
        this.sectionsShowHideInfo
      );
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(
    fieldApiName: string,
    fieldKey: string,
    selectedValue: any
  ) {
    if (this.toInitLower(fieldApiName) === "createEmployee")
      this.createEmployeeLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createEmployee") {
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
      ...this.basicDetailsSectionFields,
      ...this.jobDetailsSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [
      ...this.basicDetailsSectionFields,
      ...this.jobDetailsSectionFields];
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
    } else if (fieldName == "location1UUID" && sectionName == "basicDetails") {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "basicDetails",
        fieldName
      );
    } else if (fieldName == "location2UUID" && sectionName == "jobDetails") {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "jobDetails",
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
    } else if (processingSectionName == "basicDetails") {
      this.basicDetailsSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createEmployeeLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-employee-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "jobDetails") {
      this.jobDetailsSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createEmployeeLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-employee-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }

  updateSelectOptionsData() {
    this.basicDetailsSelectOptionsData["gender"] = OptionsList.Gender;
  }
}
