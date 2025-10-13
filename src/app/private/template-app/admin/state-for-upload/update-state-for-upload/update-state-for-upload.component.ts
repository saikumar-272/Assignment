import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateStateForUploadRequestModel
} from "src/app/shared/interfaces/dto/template-app/state-for-upload/update-state-for-upload";
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {isBlank,} from "src/app/shared/util/string-util";
import {of} from "rxjs";

@Component({
selector: "app-update-state-for-upload",
  imports: [CommonModule, AdminChildSectionFormComponent, RouterModule, NgbModule],
  templateUrl: "./update-state-for-upload.component.html",
  styleUrls: ["./update-state-for-upload.component.scss"],
  standalone: true
})
export class UpdateStateForUploadComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit State";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateStateForUploadButtonDisabled = false;
  updateStateForUploadSectionFields: any = [];
  updateStateForUploadSectionData: any = {};
  updateStateForUploadSelectOptionsData: any = {};
  updateStateForUploadSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateStateForUploadLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedStateForUploadUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateStateForUploadSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateStateForUpload"];
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
      this.selectedStateForUploadUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateStateForUpload";
    if (
      this.selectedStateForUploadUUID &&
      this.selectedStateForUploadUUID.length > 0
    ) {
      this.retrievedDataObject =
        await this.backendService.retrieveStateForUpload(
          this.selectedStateForUploadUUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateStateForUpload",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateStateForUploadRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateStateForUpload",
          this.backendService,
          this.toastNotificationService
        );
      this.updateStateForUploadSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateStateForUpload",
          updateStateForUploadRequestParamList,
          this
        );
      this.modifyData(
        "updateStateForUpload",
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
      this.updateStateForUploadSectionData = retrievedObjectInfo;
      this.updateStateForUploadLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateStateForUpload",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded(
        "updateStateForUpload",
        this,
        retrievedObjectInfo
      );
    }, 100);
  }
  async updateStateForUpload() {
    this.isUpdateStateForUploadButtonDisabled = true;
    this.resetFormErrors("updateStateForUpload");
    this.pageErrors = [];
    const requestModel: IUpdateStateForUploadRequestModel = {
      stateForUploadUUID: this.selectedStateForUploadUUID,
      name: this.updateStateForUploadSectionData["name"],
      code: this.updateStateForUploadSectionData["code"],
      countryUUID: this.updateStateForUploadSectionData["countryUUID"],
    };
    this.getUpdatedPayload(
      "updateStateForUpload",
      requestModel,
      this.updateStateForUploadSectionData,
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
      this.isUpdateStateForUploadButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateStateForUpload(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateStateForUpload",
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
          "updateStateForUpload",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateStateForUploadButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateStateForUpload")
      this.updateStateForUploadLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateStateForUpload") {
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
    let apiFieldList = [...this.updateStateForUploadSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateStateForUploadSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["countryUUID"])) {
      this.updateStateForUploadSelectedLookupsDataListObj["countryUUID"] = of([
        {
          id: retrievedObjectInfo["countryUUID"],
          value: retrievedObjectInfo["countryDisplayText"],
        },
      ]);
    }
  }

  updateSelectOptionsData() {}
}
