import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {IRetrieveEmployeeDto} from "src/app/shared/interfaces/dto/template-app/employee/retrieve-employee";
import {IUpdateEmployeeRequestModel} from "src/app/shared/interfaces/dto/template-app/employee/update-employee";
import {
    CreateApiResponseModel,
    IResponseMessage,
    RetrieveListResponseModel,
} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, YES_NO_OPTIONS} from "src/app/shared/util/constants";
import {validateAttachmentSize} from "src/app/shared/util/form-validators";
import {
    retrieveEmployeeSectionListSearchFilter
} from "src/app/shared/interfaces/dto/template-app/employee-section/retrieve-employee-section-list";
import {
    IRetrieveEmployeeSectionDto
} from "src/app/shared/interfaces/dto/template-app/employee-section/retrieve-employee-section";
import {
    retrieveEmpDependentListSearchFilter
} from "src/app/shared/interfaces/dto/template-app/emp-dependent/retrieve-emp-dependent-list";
import {
    IRetrieveEmpDependentDto
} from "src/app/shared/interfaces/dto/template-app/emp-dependent/retrieve-emp-dependent";
import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {getNumberWithCommaSeparated, isBlank,} from "src/app/shared/util/string-util";
import {of} from "rxjs";

@Component({
selector: "app-update-employee",
  templateUrl: "./update-employee.component.html",
  styleUrls: ["./update-employee.component.scss"],
  imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RetrieveEmpLocationListSearchPopupComponent, NgbModule],
  standalone: true
})
export class UpdateEmployeeComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Employee";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateEmployeeButtonDisabled = false;
  basicDetailsSectionFields: any = [];
  basicDetailsSectionData: any = {};
  basicDetailsSelectOptionsData: any = {};
  basicDetailsSelectedLookupsDataListObj: any = {};
  jobDetailsSectionFields: any = [];
  jobDetailsSectionData: any = {};
  jobDetailsSelectOptionsData: any = {};
  jobDetailsSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateEmployeeLookupDisplayTextMap: any = {};

  isCreateEmployeeSectionButtonDisabled = false;
  createEmployeeSectionLookupDisplayTextMap: any = {};
  createEmployeeSectionSectionFields: any = [];
  createEmployeeSectionSectionData: any = {};
  createEmployeeSectionSelectOptionsData: any = {};
  createEmployeeSectionSelectedLookupsDataListObj: any = {};

  isUpdateEmployeeSectionButtonDisabled = false;
  updateEmployeeSectionLookupDisplayTextMap: any = {};
  updateEmployeeSectionSectionFields: any = [];
  updateEmployeeSectionSectionData: any = {};
  updateEmployeeSectionSelectOptionsData: any = {};
  updateEmployeeSectionSelectedLookupsDataListObj: any = {};
  retrieveEmployeeSectionListResultObjectsList: Array<any> = [];

  isCreateEmpDependentButtonDisabled = false;
  createEmpDependentLookupDisplayTextMap: any = {};
  createEmpDependentSectionFields: any = [];
  createEmpDependentSectionData: any = {};
  createEmpDependentSelectOptionsData: any = {};
  createEmpDependentSelectedLookupsDataListObj: any = {};

  isUpdateEmpDependentButtonDisabled = false;
  updateEmpDependentLookupDisplayTextMap: any = {};
  updateEmpDependentSectionFields: any = [];
  updateEmpDependentSectionData: any = {};
  updateEmpDependentSelectOptionsData: any = {};
  updateEmpDependentSelectedLookupsDataListObj: any = {};
  retrieveEmpDependentListResultObjectsList: Array<any> = [];

  yesNoOptions = YES_NO_OPTIONS;
  selectedEmployeeUUID: string = "";
  selectedEmployeeSectionUUID: string = "";
  selectedEmpDependentUUID: string = "";
  experience: any = 0;
  retrieveEmployeeSectionListTableColumns: Array<any> = [];
  retrieveEmpDependentListTableColumns: Array<any> = [];
  sectionsShowHideInfo = {
    enableBasicDetailsSection: true,
    enableJobDetailsSection: true,
  };
  lineItemsSectionsShowHideInfo = {
    enableRetrieveEmployeeSectionListSection: true,
    enableRetrieveEmpDependentListSection: true,
  };
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["basicDetails", "jobDetails"];
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
      this.selectedEmployeeUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateEmployee";
    if (this.selectedEmployeeUUID && this.selectedEmployeeUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveEmployee(
        this.selectedEmployeeUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateEmployee",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let retrieveEmployeeSectionListResponseParamList =
        await this.getApiResponseParameterListCustom(
          "retrieveEmployeeSectionList",
          this.backendService,
          this.toastNotificationService
        );
      this.retrieveEmployeeSectionListTableColumns =
        this.getListApiTableColumnListCustom(
          "retrieveEmployeeSectionList",
          retrieveEmployeeSectionListResponseParamList,
          this
        );
      let retrieveEmpDependentListResponseParamList =
        await this.getApiResponseParameterListCustom(
          "retrieveEmpDependentList",
          this.backendService,
          this.toastNotificationService
        );
      this.retrieveEmpDependentListTableColumns =
        this.getListApiTableColumnListCustom(
          "retrieveEmpDependentList",
          retrieveEmpDependentListResponseParamList,
          this
        );
      this.setPageTotalAttributesData(this.retrievedDataObject);
      let updateEmployeeRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateEmployee",
          this.backendService,
          this.toastNotificationService
        );
      this.basicDetailsSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "BasicDetails",
          updateEmployeeRequestParamList,
          this
        );
      this.jobDetailsSectionFields = this.getSectionFieldsFromApiRequestParams(
        "JobDetails",
        updateEmployeeRequestParamList,
        this
      );
      this.modifyData(
        "updateEmployee",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      this.fetchRetrieveEmployeeSectionList();
      this.fetchRetrieveEmpDependentList();

      let createEmployeeSectionRequestParamList =
        await this.getApiRequestParameterListCustom(
          "createEmployeeSection",
          this.backendService,
          this.toastNotificationService
        );
      this.createEmployeeSectionSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "createEmployeeSection",
          createEmployeeSectionRequestParamList,
          this
        );

      let updateEmployeeSectionRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateEmployeeSection",
          this.backendService,
          this.toastNotificationService
        );
      this.updateEmployeeSectionSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "updateEmployeeSection",
          updateEmployeeSectionRequestParamList,
          this
        );
      let createEmpDependentRequestParamList =
        await this.getApiRequestParameterListCustom(
          "createEmpDependent",
          this.backendService,
          this.toastNotificationService
        );
      this.createEmpDependentSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "createEmpDependent",
          createEmpDependentRequestParamList,
          this
        );

      let updateEmpDependentRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateEmpDependent",
          this.backendService,
          this.toastNotificationService
        );
      this.updateEmpDependentSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "updateEmpDependent",
          updateEmpDependentRequestParamList,
          this
        );

      this.updateDisplayPropertyOfSections(
        "updateEmployee",
        "enableJobDetails",
        this.retrievedDataObject.enableJobDetails,
        this.sectionsShowHideInfo
      );
    }
  }
  async fetchRetrieveEmployeeSectionList() {
    var searchFilter: retrieveEmployeeSectionListSearchFilter = <
      retrieveEmployeeSectionListSearchFilter
    >{};
    searchFilter.employeeUUID = this.selectedEmployeeUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveEmployeeSectionList(searchFilter)
    );
    this.retrieveEmployeeSectionListResultObjectsList = searchResponse.list;
    this.retrieveEmployeeSectionListResultObjectsList =
      this.updateListApiDataWithInjectedFieldsData(
        this.retrieveEmployeeSectionListResultObjectsList,
        this.toastNotificationService
      );
    this.modifyLineItemsListData(
      "retrieveEmployeeSectionList",
      this.retrieveEmployeeSectionListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }
  async fetchRetrieveEmpDependentList() {
    var searchFilter: retrieveEmpDependentListSearchFilter = <
      retrieveEmpDependentListSearchFilter
    >{};
    searchFilter.employeeUUID = this.selectedEmployeeUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveEmpDependentList(searchFilter)
    );
    this.retrieveEmpDependentListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData(
      "retrieveEmpDependentList",
      this.retrieveEmpDependentListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }

  setPageTotalAttributesData(retrievedObjectInfo: IRetrieveEmployeeDto) {
    this.experience = getNumberWithCommaSeparated(
      retrievedObjectInfo.experience
    );
  }

  async toggleCreateEmployeeSectionPopup(modal: any) {
    this.createEmployeeSectionSectionFields = [];
    this.createEmployeeSectionSectionData = {};
    this.createEmployeeSectionLookupDisplayTextMap = {};
    let createEmployeeSectionRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createEmployeeSection",
        this.backendService,
        this.toastNotificationService
      );
    this.createEmployeeSectionSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createEmployeeSection",
        createEmployeeSectionRequestParamList,
        this
      );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-employee-section-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createEmployeeSectionSectionFields = [];
        },
        (reason) => {
          this.createEmployeeSectionSectionFields = [];
        }
      );
  }
  async toggleCreateEmpDependentPopup(modal: any) {
    this.createEmpDependentSectionFields = [];
    this.createEmpDependentSectionData = {};
    this.createEmpDependentLookupDisplayTextMap = {};
    let createEmpDependentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createEmpDependent",
        this.backendService,
        this.toastNotificationService
      );
    this.createEmpDependentSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createEmpDependent",
        createEmpDependentRequestParamList,
        this
      );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-emp-dependent-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createEmpDependentSectionFields = [];
        },
        (reason) => {
          this.createEmpDependentSectionFields = [];
        }
      );
  }

  async handleCreateEmployeeSection(modal: any) {
    this.isCreateEmployeeSectionButtonDisabled = true;
    let request: any = {
      sectionName: this.createEmployeeSectionSectionData["sectionName"],
      description: this.createEmployeeSectionSectionData["description"],
      employeeUUID: this.selectedEmployeeUUID,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateEmployeeSectionButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    let injectedFieldsDataJsonText: string = "{}";
    injectedFieldsDataJsonText = this.getUpdatedInjectedFieldsDataJsonText(
      injectedFieldsDataJsonText,
      this.createEmployeeSectionSectionFields,
      this.createEmployeeSectionSectionData
    );
    request.injectedFieldsDataJsonText = injectedFieldsDataJsonText;
    request = this.updatePayloadWithInjectedLookupFieldDisplayText(
      request,
      this.createEmployeeSectionSectionFields,
      this.createEmployeeSectionLookupDisplayTextMap
    );
    this.getUpdatedPayload(
      "createEmployeeSection",
      request,
      this.createEmployeeSectionSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: CreateApiResponseModel =
      await this.backendService.createEmployeeSection(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveEmployeeSectionList();
      let retrievedObjectInfo: IRetrieveEmployeeDto =
        await this.backendService.retrieveEmployee(this.selectedEmployeeUUID);
      this.setPageTotalAttributesData(retrievedObjectInfo);
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isCreateEmployeeSectionButtonDisabled = false;
  }
  async toggleUpdateEmployeeSectionPopup(
    modal: any,
    selectedLineItemId: string
  ) {
    this.updateEmployeeSectionSectionFields = [];
    this.updateEmployeeSectionLookupDisplayTextMap = {};
    this.selectedEmployeeSectionUUID = selectedLineItemId;
    let rowDataObject: IRetrieveEmployeeSectionDto =
      await this.backendService.retrieveEmployeeSection(selectedLineItemId);
    rowDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(
      rowDataObject,
      this.toastNotificationService
    );
    this.modifyData(
      "updateEmployeeSection",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateEmployeeSectionRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeSection",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeSectionSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeSection",
        updateEmployeeSectionRequestParamList,
        this
      );
    this.setUpdateEmployeeSectionSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToEmployeeSectionPopup(rowDataObject);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-employee-section-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmployeeSectionSectionFields = [];
        },
        (reason) => {
          this.updateEmployeeSectionSectionFields = [];
        }
      );
  }
  setValuesToEmployeeSectionPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateEmployeeSectionSectionData = { ...retrievedObjectInfo };
    }, 100);
  }
  async handleCreateEmpDependent(modal: any) {
    this.isCreateEmpDependentButtonDisabled = true;
    let request: any = {
      depEmpName: this.createEmpDependentSectionData["depEmpName"],
      employeeSectionUUID:
        this.createEmpDependentSectionData["employeeSectionUUID"],
      depEmpRelationship:
        this.createEmpDependentSectionData["depEmpRelationship"],
      isPassed: this.getBooleanParameterValue(
        this.createEmpDependentSectionData["isPassed"]
      ),
      passMarks: this.createEmpDependentSectionData["passMarks"],
      failMarks: this.createEmpDependentSectionData["failMarks"],
      employeeUUID: this.selectedEmployeeUUID,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateEmpDependentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createEmpDependent",
      request,
      this.createEmpDependentSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: CreateApiResponseModel =
      await this.backendService.createEmpDependent(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveEmpDependentList();
      let retrievedObjectInfo: IRetrieveEmployeeDto =
        await this.backendService.retrieveEmployee(this.selectedEmployeeUUID);
      this.setPageTotalAttributesData(retrievedObjectInfo);
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isCreateEmpDependentButtonDisabled = false;
  }
  async toggleUpdateEmpDependentPopup(modal: any, selectedLineItemId: string) {
    this.updateEmpDependentSectionFields = [];
    this.updateEmpDependentLookupDisplayTextMap = {};
    this.selectedEmpDependentUUID = selectedLineItemId;
    let rowDataObject: IRetrieveEmpDependentDto =
      await this.backendService.retrieveEmpDependent(selectedLineItemId);
    this.modifyData(
      "updateEmpDependent",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateEmpDependentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmpDependent",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmpDependentSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmpDependent",
        updateEmpDependentRequestParamList,
        this
      );
    this.setUpdateEmpDependentSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToEmpDependentPopup(rowDataObject);
    this.updateDisplayPropertyOfApiParameterDependentFields(
      "updateEmpDependent",
      rowDataObject,
      ["updateEmpDependent"],
      this
    );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-emp-dependent-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmpDependentSectionFields = [];
        },
        (reason) => {
          this.updateEmpDependentSectionFields = [];
        }
      );
  }
  setValuesToEmpDependentPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateEmpDependentSectionData = { ...retrievedObjectInfo };
    }, 100);
  }

  async handleUpdateEmployeeSection(modal: any) {
    this.isUpdateEmployeeSectionButtonDisabled = true;
    let request: any = {
      employeeSectionUUID: this.selectedEmployeeSectionUUID,
      sectionName: this.updateEmployeeSectionSectionData["sectionName"],
      description: this.updateEmployeeSectionSectionData["description"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateEmployeeSectionButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    let injectedFieldsDataJsonText: string = "{}";
    injectedFieldsDataJsonText = this.getUpdatedInjectedFieldsDataJsonText(
      injectedFieldsDataJsonText,
      this.updateEmployeeSectionSectionFields,
      this.updateEmployeeSectionSectionData
    );
    request.injectedFieldsDataJsonText = injectedFieldsDataJsonText;
    request = this.updatePayloadWithInjectedLookupFieldDisplayText(
      request,
      this.updateEmployeeSectionSectionFields,
      this.updateEmployeeSectionLookupDisplayTextMap
    );
    this.getUpdatedPayload(
      "updateEmployeeSection",
      request,
      this.updateEmployeeSectionSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: IResponseMessage =
      await this.backendService.updateEmployeeSection(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveEmployeeSectionList();

      let retrievedObjectInfo: IRetrieveEmployeeDto =
        await this.backendService.retrieveEmployee(this.selectedEmployeeUUID);
      this.setPageTotalAttributesData(retrievedObjectInfo);
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmployeeSectionButtonDisabled = false;
  }
  async handleUpdateEmpDependent(modal: any) {
    this.isUpdateEmpDependentButtonDisabled = true;
    let request: any = {
      empDependentUUID: this.selectedEmpDependentUUID,
      depEmpName: this.updateEmpDependentSectionData["depEmpName"],
      employeeSectionUUID:
        this.updateEmpDependentSectionData["employeeSectionUUID"],
      depEmpRelationship:
        this.updateEmpDependentSectionData["depEmpRelationship"],
      isPassed: this.getBooleanParameterValue(
        this.updateEmpDependentSectionData["isPassed"]
      ),
      passMarks: this.updateEmpDependentSectionData["passMarks"],
      failMarks: this.updateEmpDependentSectionData["failMarks"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateEmpDependentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "updateEmpDependent",
      request,
      this.updateEmpDependentSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: IResponseMessage =
      await this.backendService.updateEmpDependent(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveEmpDependentList();

      let retrievedObjectInfo: IRetrieveEmployeeDto =
        await this.backendService.retrieveEmployee(this.selectedEmployeeUUID);
      this.setPageTotalAttributesData(retrievedObjectInfo);
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmpDependentButtonDisabled = false;
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.basicDetailsSectionData = retrievedObjectInfo;
      this.jobDetailsSectionData = retrievedObjectInfo;
      this.updateEmployeeLookupDisplayTextMap = {};
      this.updateEmployeeLookupDisplayTextMap["location1UUID"] = isBlank(
        retrievedObjectInfo["location1DisplayText"]
      )
        ? ""
        : retrievedObjectInfo["location1DisplayText"];
      document
        .getElementById("update-employee-form")
        ?.querySelector("#location1UUID")
        ?.setAttribute(
          "value",
          this.updateEmployeeLookupDisplayTextMap["location1UUID"]
        );
      this.updateEmployeeLookupDisplayTextMap["location2UUID"] = isBlank(
        retrievedObjectInfo["location2DisplayText"]
      )
        ? ""
        : retrievedObjectInfo["location2DisplayText"];
      document
        .getElementById("update-employee-form")
        ?.querySelector("#location2UUID")
        ?.setAttribute(
          "value",
          this.updateEmployeeLookupDisplayTextMap["location2UUID"]
        );
      this.doAfterPageDataLoaded(
        "updateEmployee",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateEmployee", this, retrievedObjectInfo);
    }, 100);
  }
  async updateEmployee() {
    this.isUpdateEmployeeButtonDisabled = true;
    this.resetFormErrors("updateEmployee");
    this.pageErrors = [];
    const requestModel: IUpdateEmployeeRequestModel = {
      employeeUUID: this.selectedEmployeeUUID,
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
      this.isUpdateEmployeeButtonDisabled = false;
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
      this.isUpdateEmployeeButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "updateEmployee",
      requestModel,
      this.basicDetailsSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    this.getUpdatedPayload(
      "updateEmployee",
      requestModel,
      this.jobDetailsSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateEmployee(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateEmployee",
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
          "updateEmployee",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateEmployeeButtonDisabled = false;
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
        "updateEmployee",
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
    if (this.toInitLower(fieldApiName) === "updateEmployee")
      this.updateEmployeeLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateEmployee") {
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        this.pageSectionNameList
      );
    }
    if (field.apiName === "createEmpDependent")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["createEmpDependent"]
      );
    if (field.apiName === "updateEmpDependent")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["updateEmpDependent"]
      );
  }

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {}

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
      this.updateEmployeeLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "jobDetails") {
      this.jobDetailsSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateEmployeeLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "createEmployeeSection") {
      this.createEmployeeSectionSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createEmployeeSectionLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-employee-section-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateEmployeeSection") {
      this.updateEmployeeSectionSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateEmployeeSectionLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-section-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "createEmpDependent") {
      this.createEmpDependentSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.createEmpDependentLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("create-emp-dependent-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateEmpDependent") {
      this.updateEmpDependentSectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateEmpDependentLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-emp-dependent-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }
  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["locationUUID"])) {
      this.basicDetailsSelectedLookupsDataListObj["locationUUID"] = of([
        {
          id: retrievedObjectInfo["locationUUID"],
          value: retrievedObjectInfo["locationDisplayText"],
        }]);
    }
  }

  setUpdateEmployeeSectionSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    this.updateInjectedFieldsSelectedLookupData(
      this.updateEmployeeSectionSelectedLookupsDataListObj,
      retrievedObjectInfo
    );
  }
  setUpdateEmpDependentSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["employeeSectionUUID"])) {
      this.updateEmpDependentSelectedLookupsDataListObj["employeeSectionUUID"] =
        of([
          {
            id: retrievedObjectInfo["employeeSectionUUID"],
            value: retrievedObjectInfo["employeeSectionDisplayText"],
          }]);
    }
  }

  updateSelectOptionsData() {
    this.basicDetailsSelectOptionsData["gender"] = OptionsList.Gender;
  }
}
