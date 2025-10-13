import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateStateRequestModel} from "src/app/shared/interfaces/dto/template-app/state/update-state";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {isBlank} from "src/app/shared/util/string-util";
import {of} from "rxjs";
@Component({
selector: "app-update-state",
  templateUrl: "./update-state.component.html",
  styleUrls: ["./update-state.component.scss"],
  imports: [ AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateStateComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit State";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateStateButtonDisabled = false;
  updateStateSectionFields: any = [];
  updateStateSectionData: any = {};
  updateStateSelectOptionsData: any = {};
  updateStateSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateStateLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedStateUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateStateSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateState"];
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
      this.selectedStateUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateState";
    if (this.selectedStateUUID && this.selectedStateUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveState(
        this.selectedStateUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateState",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateStateRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateState",
          this.backendService,
          this.toastNotificationService
        );
      this.updateStateSectionFields = this.getSectionFieldsFromApiRequestParams(
        "UpdateState",
        updateStateRequestParamList,
        this
      );
      this.modifyData(
        "updateState",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);
    }
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.updateStateSectionData = retrievedObjectInfo;
      this.updateStateLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateState",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateState", this, retrievedObjectInfo);
    }, 100);
  }
  async updateState() {
    this.isUpdateStateButtonDisabled = true;
    this.resetFormErrors("updateState");
    this.pageErrors = [];
    const requestModel: IUpdateStateRequestModel = {
      stateUUID: this.selectedStateUUID,
      countryUUID: this.updateStateSectionData["countryUUID"],
      name: this.updateStateSectionData["name"],
      description: this.updateStateSectionData["description"],
    };
    this.getUpdatedPayload(
      "updateState",
      requestModel,
      this.updateStateSectionData,
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
      this.isUpdateStateButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateState(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateState",
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
          "updateState",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateStateButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateState")
      this.updateStateLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateState") {
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
    let apiFieldList = [...this.updateStateSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateStateSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["countryUUID"])) {
      this.updateStateSelectedLookupsDataListObj["countryUUID"] = of([
        {
          id: retrievedObjectInfo["countryUUID"],
          value: retrievedObjectInfo["countryDisplayText"],
        }]);
    }
  }

  updateSelectOptionsData() {}
}
