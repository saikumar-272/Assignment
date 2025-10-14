import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IResponseMessage, RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {Constants} from "src/app/shared/util/constants";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {IRetrieveEmployeeDto} from "src/app/shared/interfaces/dto/template-app/employee/retrieve-employee";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
import {validateAttachmentSize} from "src/app/shared/util/form-validators";
//User Actions request model
import {
    IUpdateEmployeeAllDetailsResponseModel
} from "src/app/shared/interfaces/dto/template-app/employee-details-update/update-employee-all-details";
import {
    IUpdateEmployeeBasicDetailsRequestModel
} from "src/app/shared/interfaces/dto/template-app/employee-details-update/update-employee-basic-details";
import {
    IUpdateEmployeeAttachmentsRequestModel
} from "src/app/shared/interfaces/dto/template-app/employee-details-update/update-employee-attachments";
import {IUpdateEmployeeSSRequestModel} from "src/app/shared/interfaces/dto/template-app/employee/update-employee-ss";
import {
    IUpdateEmployeeNameRequestModel
} from "src/app/shared/interfaces/dto/template-app/employee/update-employee-name";

import {
    retrieveEmployeeSectionListDataObject,
    retrieveEmployeeSectionListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/employee-section/retrieve-employee-section-list";
import {
    retrieveEmpDependentListDataObject,
    retrieveEmpDependentListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/emp-dependent/retrieve-emp-dependent-list";
import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {getNumberWithCommaSeparated, isBlank,} from "src/app/shared/util/string-util";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {of} from "rxjs";

@Component({
selector: "app-retrieve-employee",
  templateUrl: "./retrieve-employee.component.html",
  styleUrls: ["./retrieve-employee.component.scss"],
  imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, RetrieveEmpLocationListSearchPopupComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveEmployeeComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Employee";
  userActions: Array<any> = [];
  basicDetailsFieldList: Array<any> = [];
  jobDetailsFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params
  isUpdateEmployeeAllDetailsButtonDisabled = false;
  isUpdateEmployeeAllDetailsEnabled = true;
  updateEmployeeAllDetailsForm = new FormGroup({});
  updateEmployeeAllDetailsModel: any = {};
  updateEmployeeAllDetailsFields: FormlyFieldConfig[] = [];
  updateEmployeeAllDetailsLookupDisplayTextMap: any = {};

  updateEmployeeAllDetailsSectionFields: any = [];
  updateEmployeeAllDetailsSectionData: any = {};
  updateEmployeeAllDetailsSelectOptionsData: any = {};
  updateEmployeeAllDetailsSelectedLookupsDataListObj: any = {};
  isUpdateEmployeeBasicDetailsButtonDisabled = false;
  isUpdateEmployeeBasicDetailsEnabled = true;
  updateEmployeeBasicDetailsForm = new FormGroup({});
  updateEmployeeBasicDetailsModel: any = {};
  updateEmployeeBasicDetailsFields: FormlyFieldConfig[] = [];
  updateEmployeeBasicDetailsLookupDisplayTextMap: any = {};

  updateEmployeeBasicDetailsSectionFields: any = [];
  updateEmployeeBasicDetailsSectionData: any = {};
  updateEmployeeBasicDetailsSelectOptionsData: any = {};
  updateEmployeeBasicDetailsSelectedLookupsDataListObj: any = {};
  isUpdateEmployeeAttachmentsButtonDisabled = false;
  isUpdateEmployeeAttachmentsEnabled = true;
  updateEmployeeAttachmentsForm = new FormGroup({});
  updateEmployeeAttachmentsModel: any = {};
  updateEmployeeAttachmentsFields: FormlyFieldConfig[] = [];
  updateEmployeeAttachmentsLookupDisplayTextMap: any = {};

  updateEmployeeAttachmentsSectionFields: any = [];
  updateEmployeeAttachmentsSectionData: any = {};
  updateEmployeeAttachmentsSelectOptionsData: any = {};
  updateEmployeeAttachmentsSelectedLookupsDataListObj: any = {};
  isUpdateEmployeeSSButtonDisabled = false;
  isUpdateEmployeeSSEnabled = true;
  updateEmployeeSSForm = new FormGroup({});
  updateEmployeeSSModel: any = {};
  updateEmployeeSSFields: FormlyFieldConfig[] = [];
  updateEmployeeSSLookupDisplayTextMap: any = {};

  updateEmployeeSSSectionFields: any = [];
  updateEmployeeSSSectionData: any = {};
  updateEmployeeSSSelectOptionsData: any = {};
  updateEmployeeSSSelectedLookupsDataListObj: any = {};
  isUpdateEmployeeNameButtonDisabled = false;
  isUpdateEmployeeNameEnabled = true;
  updateEmployeeNameForm = new FormGroup({});
  updateEmployeeNameModel: any = {};
  updateEmployeeNameFields: FormlyFieldConfig[] = [];
  updateEmployeeNameLookupDisplayTextMap: any = {};

  updateEmployeeNameSectionFields: any = [];
  updateEmployeeNameSectionData: any = {};
  updateEmployeeNameSelectOptionsData: any = {};
  updateEmployeeNameSelectedLookupsDataListObj: any = {};

  retrieveEmployeeSectionListResultObjectsList: Array<retrieveEmployeeSectionListDataObject> =
    [];
  retrieveEmployeeSectionListTableColumns: Array<any> = [];
  retrieveEmpDependentListResultObjectsList: Array<retrieveEmpDependentListDataObject> =
    [];
  retrieveEmpDependentListTableColumns: Array<any> = [];
  selectedEmployeeUUID: string = "";
  selectedEmployeeSectionUUID: string = "";
  selectedEmpDependentUUID: string = "";
  experience: any = 0;
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
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private timeZoneService: TimeZoneService
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
    if (!(this.selectedEmployeeUUID && this.selectedEmployeeUUID.length > 0)) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveEmployee(
      this.selectedEmployeeUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveEmployee",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveEmployee");
    let retrieveEmployeeSectionListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveEmployeeSectionList",
        this.backendService,
        this.toastNotificationService,
        this
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
        this.toastNotificationService,
        this
      );
    this.retrieveEmpDependentListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveEmpDependentList",
        retrieveEmpDependentListResponseParamList,
        this
      );
    this.fetchRetrieveEmployeeSectionList();
    this.fetchRetrieveEmpDependentList();

    //Load page fields
    let retrieveEmployeeResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveEmployee",
        this.backendService,
        this.toastNotificationService
      );
    this.basicDetailsFieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveEmployee",
      "BasicDetails",
      retrieveEmployeeResponseParamList,
      this.additionalProperties
    );
    this.jobDetailsFieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveEmployee",
      "JobDetails",
      retrieveEmployeeResponseParamList,
      this.additionalProperties
    );
    this.retrievedDataObject.dateTimeWithSecondsField =
      this.timeZoneService.getTimeZoneTime(
        this.retrievedDataObject.dateTimeWithSecondsField
      );
    this.doAfterPageDataLoaded(
      "retrieveEmployee",
      this.currentRoute,
      this,
      this.retrievedDataObject
    );
    this.retrievedDataObject =
      this.updateRetrieveApiDataObjectWithInjectedFieldsData(
        this.retrievedDataObject,
        this.toastNotificationService
      );
    this.setPageTotalAttributesData(this.retrievedDataObject);
    this.modifyData(
      "retrieveEmployee",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
    let updateEmployeeAllDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeAllDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeAllDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeAllDetails",
        updateEmployeeAllDetailsRequestParamList,
        this
      );
    let updateEmployeeBasicDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeBasicDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeBasicDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeBasicDetails",
        updateEmployeeBasicDetailsRequestParamList,
        this
      );
    let updateEmployeeAttachmentsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeAttachments",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeAttachmentsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeAttachments",
        updateEmployeeAttachmentsRequestParamList,
        this
      );
    let updateEmployeeSSRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeSS",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeSSSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeSS",
        updateEmployeeSSRequestParamList,
        this
      );
    let updateEmployeeNameRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeName",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeNameSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeName",
        updateEmployeeNameRequestParamList,
        this
      );

    this.updateDisplayPropertyOfSections(
      "retrieveEmployee",
      "enableJobDetails",
      this.retrievedDataObject.enableJobDetails,
      this.sectionsShowHideInfo
    );
  }
  setPageTotalAttributesData(retrievedObjectInfo: IRetrieveEmployeeDto) {
    this.experience = getNumberWithCommaSeparated(
      retrievedObjectInfo.experience
    );
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

  //Start User actions
  async openUpdateEmployeeAllDetailsPopup(modal: any) {
    this.updateEmployeeAllDetailsSectionFields = [];
    this.updateEmployeeAllDetailsSectionData = {};
    let updateEmployeeAllDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeAllDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeAllDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeAllDetails",
        updateEmployeeAllDetailsRequestParamList,
        this
      );
    this.setUpdateEmployeeAllDetailsSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmployeeAllDetailsLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateEmployeeAllDetailsSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateEmployeeAllDetailsForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-employee-all-details-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmployeeAllDetailsForm.reset();
        },
        (reason) => {
          this.updateEmployeeAllDetailsForm.reset();
        }
      );
  }
  async openUpdateEmployeeBasicDetailsPopup(modal: any) {
    this.updateEmployeeBasicDetailsSectionFields = [];
    this.updateEmployeeBasicDetailsSectionData = {};
    let updateEmployeeBasicDetailsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeBasicDetails",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeBasicDetailsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeBasicDetails",
        updateEmployeeBasicDetailsRequestParamList,
        this
      );
    this.setUpdateEmployeeBasicDetailsSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmployeeBasicDetailsLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateEmployeeBasicDetailsSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateEmployeeBasicDetailsForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-employee-basic-details-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmployeeBasicDetailsForm.reset();
        },
        (reason) => {
          this.updateEmployeeBasicDetailsForm.reset();
        }
      );
  }
  async openUpdateEmployeeAttachmentsPopup(modal: any) {
    this.updateEmployeeAttachmentsSectionFields = [];
    this.updateEmployeeAttachmentsSectionData = {};
    let updateEmployeeAttachmentsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeAttachments",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeAttachmentsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeAttachments",
        updateEmployeeAttachmentsRequestParamList,
        this
      );
    this.setUpdateEmployeeAttachmentsSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmployeeAttachmentsLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateEmployeeAttachmentsSectionData = {
        ...this.retrievedDataObject,
      };
      this.updateEmployeeAttachmentsForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-employee-attachments-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmployeeAttachmentsForm.reset();
        },
        (reason) => {
          this.updateEmployeeAttachmentsForm.reset();
        }
      );
  }
  async openUpdateEmployeeSSPopup(modal: any) {
    this.updateEmployeeSSSectionFields = [];
    this.updateEmployeeSSSectionData = {};
    let updateEmployeeSSRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeSS",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeSSSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeSS",
        updateEmployeeSSRequestParamList,
        this
      );
    this.setUpdateEmployeeSSSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmployeeSSLookupDisplayTextMap = {};
    this.updateEmployeeSSLookupDisplayTextMap["location1UUID"] = isBlank(
      this.retrievedDataObject["location1UUID"]
    )
      ? ""
      : this.retrievedDataObject["location1DisplayText"];
    this.updateEmployeeSSLookupDisplayTextMap["location2UUID"] = isBlank(
      this.retrievedDataObject["location2UUID"]
    )
      ? ""
      : this.retrievedDataObject["location2DisplayText"];
    setTimeout(() => {
      this.updateEmployeeSSSectionData = { ...this.retrievedDataObject };
      this.updateEmployeeSSForm.patchValue(this.retrievedDataObject);
      document
        .getElementById("update-employee-ss-modal-body")
        ?.querySelector("#location1UUID")
        ?.setAttribute(
          "value",
          this.updateEmployeeSSLookupDisplayTextMap["location1UUID"]
        );
      document
        .getElementById("update-employee-ss-modal-body")
        ?.querySelector("#location2UUID")
        ?.setAttribute(
          "value",
          this.updateEmployeeSSLookupDisplayTextMap["location2UUID"]
        );
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-employee-ss-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmployeeSSForm.reset();
        },
        (reason) => {
          this.updateEmployeeSSForm.reset();
        }
      );
  }
  async openUpdateEmployeeNamePopup(modal: any) {
    this.updateEmployeeNameSectionFields = [];
    this.updateEmployeeNameSectionData = {};
    let updateEmployeeNameRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateEmployeeName",
        this.backendService,
        this.toastNotificationService
      );
    this.updateEmployeeNameSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateEmployeeName",
        updateEmployeeNameRequestParamList,
        this
      );
    this.setUpdateEmployeeNameSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updateEmployeeNameLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updateEmployeeNameSectionData = { ...this.retrievedDataObject };
      this.updateEmployeeNameForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-employee-name-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateEmployeeNameForm.reset();
        },
        (reason) => {
          this.updateEmployeeNameForm.reset();
        }
      );
  }

  async updateEmployeeAllDetails(modal: any) {
    this.isUpdateEmployeeAllDetailsButtonDisabled = true;
    const employeeUUID = this.selectedEmployeeUUID;
    const firstName = this.updateEmployeeAllDetailsSectionData["firstName"];
    const lastName = this.updateEmployeeAllDetailsSectionData["lastName"];
    const emailId = this.updateEmployeeAllDetailsSectionData["emailId"];
    const joininigDate =
      this.updateEmployeeAllDetailsSectionData["joininigDate"];
    const gender = this.getComboParameterValue(
      this.updateEmployeeAllDetailsSectionData["gender"]
    );
    const dateTimeField =
      this.updateEmployeeAllDetailsSectionData["dateTimeField"];
    const dateTimeWithSecondsField =
      this.updateEmployeeAllDetailsSectionData["dateTimeWithSecondsField"];
    const timeField = this.updateEmployeeAllDetailsSectionData["timeField"];
    const timeWithSecondsField =
      this.updateEmployeeAllDetailsSectionData["timeWithSecondsField"];
    const noOfChildren =
      this.updateEmployeeAllDetailsSectionData["noOfChildren"];
    const salary = this.updateEmployeeAllDetailsSectionData["salary"];
    const hike = this.updateEmployeeAllDetailsSectionData["hike"];
    const objectId = this.updateEmployeeAllDetailsSectionData["objectId"];
    const locationUUID =
      this.updateEmployeeAllDetailsSectionData["locationUUID"];
    const experience = this.updateEmployeeAllDetailsSectionData["experience"];
    const isUserValidated = this.getBooleanParameterValue(
      this.updateEmployeeAllDetailsSectionData["isUserValidated"]
    );
    const response: IUpdateEmployeeAllDetailsResponseModel =
      await this.backendService.updateEmployeeAllDetails(
        employeeUUID,
        firstName,
        lastName,
        emailId,
        joininigDate,
        gender,
        dateTimeField,
        dateTimeWithSecondsField,
        timeField,
        timeWithSecondsField,
        noOfChildren,
        salary,
        hike,
        objectId,
        locationUUID,
        experience,
        isUserValidated
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmployeeAllDetails",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmployeeAllDetailsButtonDisabled = false;
  }
  async updateEmployeeBasicDetails(modal: any) {
    this.isUpdateEmployeeBasicDetailsButtonDisabled = true;
    const updateEmployeeBasicDetailsRequestModel: IUpdateEmployeeBasicDetailsRequestModel =
      {
        firstName: this.updateEmployeeBasicDetailsSectionData["firstName"],
        lastName: this.updateEmployeeBasicDetailsSectionData["lastName"],
        emailId: this.updateEmployeeBasicDetailsSectionData["emailId"],
        locationUUID:
          this.updateEmployeeBasicDetailsSectionData["locationUUID"],
        gender: this.getComboParameterValue(
          this.updateEmployeeBasicDetailsSectionData["gender"]
        ),
        joininigDate:
          this.updateEmployeeBasicDetailsSectionData["joininigDate"],
        objectId: this.updateEmployeeBasicDetailsSectionData["objectId"],
        isUserValidated: this.getBooleanParameterValue(
          this.updateEmployeeBasicDetailsSectionData["isUserValidated"]
        ),
        employeeUUID: this.selectedEmployeeUUID,
      };
    const response: IResponseMessage =
      await this.backendService.updateEmployeeBasicDetails(
        updateEmployeeBasicDetailsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmployeeBasicDetails",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmployeeBasicDetailsButtonDisabled = false;
  }
  async updateEmployeeAttachments(modal: any) {
    this.isUpdateEmployeeAttachmentsButtonDisabled = true;
    const updateEmployeeAttachmentsRequestModel: IUpdateEmployeeAttachmentsRequestModel =
      {
        firstName: this.updateEmployeeAttachmentsSectionData["firstName"],
        lastName: this.updateEmployeeAttachmentsSectionData["lastName"],
        emailId: this.updateEmployeeAttachmentsSectionData["emailId"],
        attachments: this.updateEmployeeAttachmentsSectionData["attachments"],
        objectId: this.updateEmployeeAttachmentsSectionData["objectId"],
        isUserValidated: this.getBooleanParameterValue(
          this.updateEmployeeAttachmentsSectionData["isUserValidated"]
        ),
        employeeUUID: this.selectedEmployeeUUID,
      };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Attachments",
      updateEmployeeAttachmentsRequestModel.attachments,
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
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      updateEmployeeAttachmentsRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateEmployeeAttachmentsButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.updateEmployeeAttachments(
        updateEmployeeAttachmentsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmployeeAttachments",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmployeeAttachmentsButtonDisabled = false;
  }
  async updateEmployeeSS(modal: any) {
    this.isUpdateEmployeeSSButtonDisabled = true;
    const updateEmployeeSSRequestModel: IUpdateEmployeeSSRequestModel = {
      firstName: this.updateEmployeeSSSectionData["firstName"],
      lastName: this.updateEmployeeSSSectionData["lastName"],
      emailId: this.updateEmployeeSSSectionData["emailId"],
      noOfChildren: this.updateEmployeeSSSectionData["noOfChildren"],
      dateTimeWithSecondsField:
        this.updateEmployeeSSSectionData["dateTimeWithSecondsField"],
      enableJobDetails: this.getBooleanParameterValue(
        this.updateEmployeeSSSectionData["enableJobDetails"]
      ),
      attachments: this.updateEmployeeSSSectionData["attachments"],
      locationUUID: this.updateEmployeeSSSectionData["locationUUID"],
      joininigDate: this.updateEmployeeSSSectionData["joininigDate"],
      gender: this.getComboParameterValue(
        this.updateEmployeeSSSectionData["gender"]
      ),
      dateTimeField: this.updateEmployeeSSSectionData["dateTimeField"],
      timeField: this.updateEmployeeSSSectionData["timeField"],
      timeWithSecondsField:
        this.updateEmployeeSSSectionData["timeWithSecondsField"],
      location1UUID: this.updateEmployeeSSSectionData["location1UUID"],
      location2UUID: this.updateEmployeeSSSectionData["location2UUID"],
      salary: this.updateEmployeeSSSectionData["salary"],
      hike: this.updateEmployeeSSSectionData["hike"],
      objectId: this.updateEmployeeSSSectionData["objectId"],
      isUserValidated: this.getBooleanParameterValue(
        this.updateEmployeeSSSectionData["isUserValidated"]
      ),
      employeeUUID: this.selectedEmployeeUUID,
    };
    let errorMessage: string = "";
    errorMessage += validateAttachmentSize(
      "Attachments",
      updateEmployeeSSRequestModel.attachments,
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
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      updateEmployeeSSRequestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateEmployeeSSButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const response: IResponseMessage =
      await this.backendService.updateEmployeeSS(updateEmployeeSSRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmployeeSS",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmployeeSSButtonDisabled = false;
  }
  async updateEmployeeName(modal: any) {
    this.isUpdateEmployeeNameButtonDisabled = true;
    const updateEmployeeNameRequestModel: IUpdateEmployeeNameRequestModel = {
      nameToUpdate: this.updateEmployeeNameSectionData["nameToUpdate"],
      employeeUUID: this.selectedEmployeeUUID,
    };
    const response: IResponseMessage =
      await this.backendService.updateEmployeeName(
        updateEmployeeNameRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdateEmployeeName",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateEmployeeNameButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(actionName, "RetrieveEmployee", this.router, {
      id: this.selectedEmployeeUUID,
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
      sectionName == "updateEmployeeSS"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "updateEmployeeSS",
        fieldName
      );
    } else if (
      fieldName == "location2UUID" &&
      sectionName == "updateEmployeeSS"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "updateEmployeeSS",
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
    } else if (processingSectionName == "updateEmployeeAllDetails") {
      this.updateEmployeeAllDetailsForm.patchValue(dataObject);
      this.updateEmployeeAllDetailsLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-all-details-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-employee-all-details-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateEmployeeBasicDetails") {
      this.updateEmployeeBasicDetailsForm.patchValue(dataObject);
      this.updateEmployeeBasicDetailsLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-basic-details-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-employee-basic-details-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateEmployeeAttachments") {
      this.updateEmployeeAttachmentsForm.patchValue(dataObject);
      this.updateEmployeeAttachmentsLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-attachments-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-employee-attachments-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateEmployeeSS") {
      this.updateEmployeeSSForm.patchValue(dataObject);
      this.updateEmployeeSSLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-ss-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-employee-ss-modal-body")
        ?.querySelector("#" + processingFieldName + "_2")
        ?.setAttribute("value", displayText);
    } else if (processingSectionName == "updateEmployeeName") {
      this.updateEmployeeNameForm.patchValue(dataObject);
      this.updateEmployeeNameLookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-employee-name-modal-body")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
      document
        .getElementById("update-employee-name-modal-body")
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
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {}
  showUserActions(): boolean {
    return (
      this.doesUserHaveAccess("UpdateEmployeeAllDetails") ||
      this.doesUserHaveAccess("UpdateEmployeeBasicDetails") ||
      this.doesUserHaveAccess("UpdateEmployeeAttachments") ||
      this.doesUserHaveAccess("UpdateEmployeeSS") ||
      this.doesUserHaveAccess("UpdateEmployeeName") ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData() {
    this.updateEmployeeAllDetailsSelectOptionsData["gender"] =
      OptionsList.Gender;
    this.updateEmployeeBasicDetailsSelectOptionsData["gender"] =
      OptionsList.Gender;
    this.updateEmployeeSSSelectOptionsData["gender"] = OptionsList.Gender;
  }
  setUpdateEmployeeAllDetailsSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {
    if (!isBlank(retrievedObjectInfo["locationUUID"])) {
      this.updateEmployeeAllDetailsSelectedLookupsDataListObj["locationUUID"] =
        of([
          {
            id: retrievedObjectInfo["locationUUID"],
            value: retrievedObjectInfo["locationDisplayText"],
          }]);
    }
  }
  setUpdateEmployeeBasicDetailsSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {
    if (!isBlank(retrievedObjectInfo["locationUUID"])) {
      this.updateEmployeeBasicDetailsSelectedLookupsDataListObj[
        "locationUUID"
      ] = of([
        {
          id: retrievedObjectInfo["locationUUID"],
          value: retrievedObjectInfo["locationDisplayText"],
        }]);
    }
  }
  setUpdateEmployeeAttachmentsSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
  setUpdateEmployeeSSSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["locationUUID"])) {
      this.updateEmployeeSSSelectedLookupsDataListObj["locationUUID"] = of([
        {
          id: retrievedObjectInfo["locationUUID"],
          value: retrievedObjectInfo["locationDisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["location1UUID"])) {
      this.updateEmployeeSSSelectedLookupsDataListObj["location1UUID"] = of([
        {
          id: retrievedObjectInfo["location1UUID"],
          value: retrievedObjectInfo["location1DisplayText"],
        }]);
    }
    if (!isBlank(retrievedObjectInfo["location2UUID"])) {
      this.updateEmployeeSSSelectedLookupsDataListObj["location2UUID"] = of([
        {
          id: retrievedObjectInfo["location2UUID"],
          value: retrievedObjectInfo["location2DisplayText"],
        }]);
    }
  }
  setUpdateEmployeeNameSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
}
