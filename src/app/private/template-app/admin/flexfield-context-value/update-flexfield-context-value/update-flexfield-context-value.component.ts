import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateFlexfieldContextValueRequestModel
} from "src/app/shared/interfaces/dto/template-app/flexfield-context-value/update-flexfield-context-value";
import {
    CreateApiResponseModel,
    IResponseMessage,
    RetrieveListResponseModel,
} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {
    retrieveFlexfieldSegmentListSearchFilter
} from "src/app/shared/interfaces/dto/template-app/flexfield-segment/retrieve-flexfield-segment-list";
import {
    IRetrieveFlexfieldSegmentDto
} from "src/app/shared/interfaces/dto/template-app/flexfield-segment/retrieve-flexfield-segment";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {isBlank} from "src/app/shared/util/string-util";
import {of} from "rxjs";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";

@Component({
selector: "app-update-flexfield-context-value",
  templateUrl: "./update-flexfield-context-value.component.html",
  styleUrls: ["./update-flexfield-context-value.component.scss"],
  imports: [ AdminChildSectionFormComponent, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateFlexfieldContextValueComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Flexfield Context Value";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateFlexfieldContextValueButtonDisabled = false;
  updateFlexfieldContextValueSectionFields: any = [];
  updateFlexfieldContextValueSectionData: any = {};
  updateFlexfieldContextValueSelectOptionsData: any = {};
  updateFlexfieldContextValueSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateFlexfieldContextValueLookupDisplayTextMap: any = {};

  isCreateFlexfieldSegmentButtonDisabled = false;
  createFlexfieldSegmentLookupDisplayTextMap: any = {};
  createFlexfieldSegmentSectionFields: any = [];
  createFlexfieldSegmentSectionData: any = {};
  createFlexfieldSegmentSelectOptionsData: any = {};
  createFlexfieldSegmentSelectedLookupsDataListObj: any = {};

  isUpdateFlexfieldSegmentButtonDisabled = false;
  updateFlexfieldSegmentLookupDisplayTextMap: any = {};
  updateFlexfieldSegmentSectionFields: any = [];
  updateFlexfieldSegmentSectionData: any = {};
  updateFlexfieldSegmentSelectOptionsData: any = {};
  updateFlexfieldSegmentSelectedLookupsDataListObj: any = {};
  retrieveFlexfieldSegmentListResultObjectsList: Array<any> = [];

  yesNoOptions = YES_NO_OPTIONS;
  selectedFlexfieldContextValueUUID: string = "";
  selectedFlexfieldSegmentUUID: string = "";
  retrieveFlexfieldSegmentListTableColumns: Array<any> = [];
  sectionsShowHideInfo = {
    enableUpdateFlexfieldContextValueSection: true,
  };
  lineItemsSectionsShowHideInfo = {
    enableRetrieveFlexfieldSegmentListSection: true,
  };

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateFlexfieldContextValue"];
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
      this.selectedFlexfieldContextValueUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateFlexfieldContextValue";
    if (
      this.selectedFlexfieldContextValueUUID &&
      this.selectedFlexfieldContextValueUUID.length > 0
    ) {
      this.retrievedDataObject =
        await this.backendService.retrieveFlexfieldContextValue(
          this.selectedFlexfieldContextValueUUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateFlexfieldContextValue",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let retrieveFlexfieldSegmentListResponseParamList =
        await this.getApiResponseParameterListCustom(
          "retrieveFlexfieldSegmentList",
          this.backendService,
          this.toastNotificationService
        );
      this.retrieveFlexfieldSegmentListTableColumns =
        this.getListApiTableColumnListCustom(
          "retrieveFlexfieldSegmentList",
          retrieveFlexfieldSegmentListResponseParamList,
          this
        );
      let updateFlexfieldContextValueRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateFlexfieldContextValue",
          this.backendService,
          this.toastNotificationService
        );
      this.updateFlexfieldContextValueSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateFlexfieldContextValue",
          updateFlexfieldContextValueRequestParamList,
          this
        );
      this.modifyData(
        "updateFlexfieldContextValue",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      this.fetchRetrieveFlexfieldSegmentList();

      let createFlexfieldSegmentRequestParamList =
        await this.getApiRequestParameterListCustom(
          "createFlexfieldSegment",
          this.backendService,
          this.toastNotificationService
        );
      this.createFlexfieldSegmentSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "createFlexfieldSegment",
          createFlexfieldSegmentRequestParamList,
          this
        );

      let updateFlexfieldSegmentRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateFlexfieldSegment",
          this.backendService,
          this.toastNotificationService
        );
      this.updateFlexfieldSegmentSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "updateFlexfieldSegment",
          updateFlexfieldSegmentRequestParamList,
          this
        );
    }
  }
  async fetchRetrieveFlexfieldSegmentList() {
    var searchFilter: retrieveFlexfieldSegmentListSearchFilter = <
      retrieveFlexfieldSegmentListSearchFilter
    >{};
    searchFilter.flexfieldContextValueUUID =
      this.selectedFlexfieldContextValueUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveFlexfieldSegmentList(searchFilter)
    );
    this.retrieveFlexfieldSegmentListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData(
      "retrieveFlexfieldSegmentList",
      this.retrieveFlexfieldSegmentListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }

  async toggleCreateFlexfieldSegmentPopup(modal: any) {
    this.createFlexfieldSegmentSectionFields = [];
    this.createFlexfieldSegmentSectionData = {};
    this.createFlexfieldSegmentLookupDisplayTextMap = {};
    let createFlexfieldSegmentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createFlexfieldSegment",
        this.backendService,
        this.toastNotificationService
      );
    this.createFlexfieldSegmentSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "createFlexfieldSegment",
        createFlexfieldSegmentRequestParamList,
        this
      );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-flexfield-segment-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createFlexfieldSegmentSectionFields = [];
        },
        (reason) => {
          this.createFlexfieldSegmentSectionFields = [];
        }
      );
  }

  async handleCreateFlexfieldSegment(modal: any) {
    this.isCreateFlexfieldSegmentButtonDisabled = true;
    let request: any = {
      segmentName: this.createFlexfieldSegmentSectionData["segmentName"],
      segmentLabel: this.createFlexfieldSegmentSectionData["segmentLabel"],
      isGlobal: this.getBooleanParameterValue(
        this.createFlexfieldSegmentSectionData["isGlobal"]
      ),
      isMandatory: this.getBooleanParameterValue(
        this.createFlexfieldSegmentSectionData["isMandatory"]
      ),
      segmentOrder: this.createFlexfieldSegmentSectionData["segmentOrder"],
      isActive: this.getBooleanParameterValue(
        this.createFlexfieldSegmentSectionData["isActive"]
      ),
      flexfieldContextValueUUID: this.selectedFlexfieldContextValueUUID,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateFlexfieldSegmentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createFlexfieldSegment",
      request,
      this.createFlexfieldSegmentSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: CreateApiResponseModel =
      await this.backendService.createFlexfieldSegment(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveFlexfieldSegmentList();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isCreateFlexfieldSegmentButtonDisabled = false;
  }
  async toggleUpdateFlexfieldSegmentPopup(
    modal: any,
    selectedLineItemId: string
  ) {
    this.updateFlexfieldSegmentSectionFields = [];
    this.updateFlexfieldSegmentLookupDisplayTextMap = {};
    this.selectedFlexfieldSegmentUUID = selectedLineItemId;
    let rowDataObject: IRetrieveFlexfieldSegmentDto =
      await this.backendService.retrieveFlexfieldSegment(selectedLineItemId);
    this.modifyData(
      "updateFlexfieldSegment",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateFlexfieldSegmentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateFlexfieldSegment",
        this.backendService,
        this.toastNotificationService
      );
    this.updateFlexfieldSegmentSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updateFlexfieldSegment",
        updateFlexfieldSegmentRequestParamList,
        this
      );
    this.setUpdateFlexfieldSegmentSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToFlexfieldSegmentPopup(rowDataObject);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-flexfield-segment-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateFlexfieldSegmentSectionFields = [];
        },
        (reason) => {
          this.updateFlexfieldSegmentSectionFields = [];
        }
      );
  }
  setValuesToFlexfieldSegmentPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateFlexfieldSegmentSectionData = { ...retrievedObjectInfo };
    }, 100);
  }

  async handleUpdateFlexfieldSegment(modal: any) {
    this.isUpdateFlexfieldSegmentButtonDisabled = true;
    let request: any = {
      flexfieldSegmentUUID: this.selectedFlexfieldSegmentUUID,
      segmentName: this.updateFlexfieldSegmentSectionData["segmentName"],
      segmentLabel: this.updateFlexfieldSegmentSectionData["segmentLabel"],
      isGlobal: this.getBooleanParameterValue(
        this.updateFlexfieldSegmentSectionData["isGlobal"]
      ),
      isMandatory: this.getBooleanParameterValue(
        this.updateFlexfieldSegmentSectionData["isMandatory"]
      ),
      segmentOrder: this.updateFlexfieldSegmentSectionData["segmentOrder"],
      isActive: this.getBooleanParameterValue(
        this.updateFlexfieldSegmentSectionData["isActive"]
      ),
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateFlexfieldSegmentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "updateFlexfieldSegment",
      request,
      this.updateFlexfieldSegmentSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: IResponseMessage =
      await this.backendService.updateFlexfieldSegment(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveFlexfieldSegmentList();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateFlexfieldSegmentButtonDisabled = false;
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.updateFlexfieldContextValueSectionData = retrievedObjectInfo;
      this.updateFlexfieldContextValueLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateFlexfieldContextValue",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded(
        "updateFlexfieldContextValue",
        this,
        retrievedObjectInfo
      );
    }, 100);
  }
  async updateFlexfieldContextValue() {
    this.isUpdateFlexfieldContextValueButtonDisabled = true;
    this.resetFormErrors("updateFlexfieldContextValue");
    this.pageErrors = [];
    const requestModel: IUpdateFlexfieldContextValueRequestModel = {
      flexfieldContextValueUUID: this.selectedFlexfieldContextValueUUID,
      code: this.updateFlexfieldContextValueSectionData["code"],
      flexfieldUUID:
        this.updateFlexfieldContextValueSectionData["flexfieldUUID"],
      displayValue: this.updateFlexfieldContextValueSectionData["displayValue"],
    };
    this.getUpdatedPayload(
      "updateFlexfieldContextValue",
      requestModel,
      this.updateFlexfieldContextValueSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateFlexfieldContextValueButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateFlexfieldContextValue(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateFlexfieldContextValue",
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
          "updateFlexfieldContextValue",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateFlexfieldContextValueButtonDisabled = false;
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
  }
  updateLookupDisplayTextMap(
    fieldApiName: string,
    fieldKey: string,
    selectedValue: any
  ) {
    if (this.toInitLower(fieldApiName) === "updateFlexfieldContextValue")
      this.updateFlexfieldContextValueLookupDisplayTextMap[fieldKey] =
        selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateFlexfieldContextValue") {
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
  ) {}

  hideSectionField(key: string) {
    let apiFieldList = [...this.updateFlexfieldContextValueSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateFlexfieldContextValueSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["flexfieldUUID"])) {
      this.updateFlexfieldContextValueSelectedLookupsDataListObj[
        "flexfieldUUID"
      ] = of([
        {
          id: retrievedObjectInfo["flexfieldUUID"],
          value: retrievedObjectInfo["flexfieldDisplayText"],
        }]);
    }
  }

  setUpdateFlexfieldSegmentSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}

  updateSelectOptionsData() {}
}
