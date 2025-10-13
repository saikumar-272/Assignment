import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateParentRequestModel} from "src/app/shared/interfaces/dto/template-app/parent/update-parent";
import {
    CreateApiResponseModel,
    IResponseMessage,
    RetrieveListResponseModel,
} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {retrieveChildListSearchFilter} from "src/app/shared/interfaces/dto/template-app/child/retrieve-child-list";
import {IRetrieveChildDto} from "src/app/shared/interfaces/dto/template-app/child/retrieve-child";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-update-parent",
  templateUrl: "./update-parent.component.html",
  styleUrls: ["./update-parent.component.scss"],
  imports: [BrowserAnimationsModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateParentComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Parent";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateParentButtonDisabled = false;
  updateParentSectionFields: any = [];
  updateParentSectionData: any = {};
  updateParentSelectOptionsData: any = {};
  updateParentSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateParentLookupDisplayTextMap: any = {};

  isCreateChildButtonDisabled = false;
  createChildLookupDisplayTextMap: any = {};
  createChildSectionFields: any = [];
  createChildSectionData: any = {};
  createChildSelectOptionsData: any = {};
  createChildSelectedLookupsDataListObj: any = {};

  isUpdateChildButtonDisabled = false;
  updateChildLookupDisplayTextMap: any = {};
  updateChildSectionFields: any = [];
  updateChildSectionData: any = {};
  updateChildSelectOptionsData: any = {};
  updateChildSelectedLookupsDataListObj: any = {};
  retrieveChildListResultObjectsList: Array<any> = [];

  yesNoOptions = YES_NO_OPTIONS;
  selectedParentUUID: string = "";
  selectedChildUUID: string = "";
  retrieveChildListTableColumns: Array<any> = [];
  sectionsShowHideInfo = {
    enableUpdateParentSection: true,
  };
  lineItemsSectionsShowHideInfo = {
    enableRetrieveChildListSection: true,
  };

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateParent"];
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
      this.selectedParentUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateParent";
    if (this.selectedParentUUID && this.selectedParentUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveParent(
        this.selectedParentUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateParent",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let retrieveChildListResponseParamList =
        await this.getApiResponseParameterListCustom(
          "retrieveChildList",
          this.backendService,
          this.toastNotificationService
        );
      this.retrieveChildListTableColumns = this.getListApiTableColumnListCustom(
        "retrieveChildList",
        retrieveChildListResponseParamList,
        this
      );
      let updateParentRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateParent",
          this.backendService,
          this.toastNotificationService
        );
      this.updateParentSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateParent",
          updateParentRequestParamList,
          this
        );
      this.modifyData(
        "updateParent",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      this.fetchRetrieveChildList();

      let createChildRequestParamList =
        await this.getApiRequestParameterListCustom(
          "createChild",
          this.backendService,
          this.toastNotificationService
        );
      this.createChildSectionFields = this.getSectionFieldsFromApiRequestParams(
        "createChild",
        createChildRequestParamList,
        this
      );

      let updateChildRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateChild",
          this.backendService,
          this.toastNotificationService
        );
      this.updateChildSectionFields = this.getSectionFieldsFromApiRequestParams(
        "updateChild",
        updateChildRequestParamList,
        this
      );
    }
  }
  async fetchRetrieveChildList() {
    var searchFilter: retrieveChildListSearchFilter = <
      retrieveChildListSearchFilter
    >{};
    searchFilter.parentUUID = this.selectedParentUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveChildList(searchFilter)
    );
    this.retrieveChildListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData(
      "retrieveChildList",
      this.retrieveChildListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }

  async toggleCreateChildPopup(modal: any) {
    this.createChildSectionFields = [];
    this.createChildSectionData = {};
    this.createChildLookupDisplayTextMap = {};
    let createChildRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createChild",
        this.backendService,
        this.toastNotificationService
      );
    this.createChildSectionFields = this.getSectionFieldsFromApiRequestParams(
      "createChild",
      createChildRequestParamList,
      this
    );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-child-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createChildSectionFields = [];
        },
        (reason) => {
          this.createChildSectionFields = [];
        }
      );
  }

  async handleCreateChild(modal: any) {
    this.isCreateChildButtonDisabled = true;
    let request: any = {
      childFirstName: this.createChildSectionData["childFirstName"],
      childLastName: this.createChildSectionData["childLastName"],
      parentUUID: this.selectedParentUUID,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateChildButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createChild",
      request,
      this.createChildSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: CreateApiResponseModel =
      await this.backendService.createChild(request);
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveChildList();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isCreateChildButtonDisabled = false;
  }
  async toggleUpdateChildPopup(modal: any, selectedLineItemId: string) {
    this.updateChildSectionFields = [];
    this.updateChildLookupDisplayTextMap = {};
    this.selectedChildUUID = selectedLineItemId;
    let rowDataObject: IRetrieveChildDto =
      await this.backendService.retrieveChild(selectedLineItemId);
    this.modifyData(
      "retrieveChild",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateChildRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateChild",
        this.backendService,
        this.toastNotificationService
      );
    this.updateChildSectionFields = this.getSectionFieldsFromApiRequestParams(
      "updateChild",
      updateChildRequestParamList,
      this
    );
    this.setUpdateChildSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToChildPopup(rowDataObject);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-child-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateChildSectionFields = [];
        },
        (reason) => {
          this.updateChildSectionFields = [];
        }
      );
  }
  setValuesToChildPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateChildSectionData = { ...retrievedObjectInfo };
    }, 100);
  }

  async handleUpdateChild(modal: any) {
    this.isUpdateChildButtonDisabled = true;
    let request: any = {
      childUUID: this.selectedChildUUID,
      childFirstName: this.updateChildSectionData["childFirstName"],
      childLastName: this.updateChildSectionData["childLastName"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateChildButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "updateChild",
      request,
      this.updateChildSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const response: IResponseMessage = await this.backendService.updateChild(
      request
    );
    if (response.success === Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      await this.fetchRetrieveChildList();
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdateChildButtonDisabled = false;
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.updateParentSectionData = retrievedObjectInfo;
      this.updateParentLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateParent",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateParent", this, retrievedObjectInfo);
    }, 100);
  }
  async updateParent() {
    this.isUpdateParentButtonDisabled = true;
    this.resetFormErrors("updateParent");
    this.pageErrors = [];
    const requestModel: IUpdateParentRequestModel = {
      parentUUID: this.selectedParentUUID,
      firstName: this.updateParentSectionData["firstName"],
      lastName: this.updateParentSectionData["lastName"],
      mobileNumber: this.updateParentSectionData["mobileNumber"],
    };
    this.getUpdatedPayload(
      "updateParent",
      requestModel,
      this.updateParentSectionData,
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
      this.isUpdateParentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateParent(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateParent",
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
          "updateParent",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateParentButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateParent")
      this.updateParentLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateParent") {
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
    let apiFieldList = [...this.updateParentSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateParentSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  setUpdateChildSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
