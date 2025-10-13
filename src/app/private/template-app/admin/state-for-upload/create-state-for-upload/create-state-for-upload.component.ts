import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateStateForUploadRequestModel
} from "src/app/shared/interfaces/dto/template-app/state-for-upload/create-state-for-upload";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-create-state-for-upload",
  templateUrl: "./create-state-for-upload.component.html",
  styleUrls: ["./create-state-for-upload.component.scss"],
  imports: [AdminChildSectionFormComponent, BrowserAnimationsModule, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class CreateStateForUploadComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New State";
  pageErrors: any = [];
  isCreateStateForUploadButtonDisabled = false;
  createStateForUploadSectionFields: any = [];
  createStateForUploadSectionData: any = {};
  createStateForUploadSelectOptionsData: any = {};
  pageComponentReference: any;
  createStateForUploadLookupDisplayTextMap: any = {};

  createStateForUpload_countryList: any[];
  selected_createStateForUpload_countryUUID: string;
  sectionsShowHideInfo = {
    enableCreateStateForUploadSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createStateForUpload"];
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
    this.createStateForUpload_countryList = [];
    this.selected_createStateForUpload_countryUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createStateForUpload",
      this.toastNotificationService,
      this.backendService
    );

    let createStateForUploadRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createStateForUpload",
        this.backendService,
        this.toastNotificationService
      );
    this.createStateForUploadSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateStateForUpload",
        createStateForUploadRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createStateForUpload",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createStateForUpload",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createStateForUpload() {
    this.isCreateStateForUploadButtonDisabled = true;
    this.resetFormErrors("createStateForUpload");
    this.pageErrors = [];
    const requestModel: ICreateStateForUploadRequestModel = {
      name: this.createStateForUploadSectionData["name"],
      code: this.createStateForUploadSectionData["code"],
      countryUUID: this.createStateForUploadSectionData["countryUUID"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateStateForUploadButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createStateForUpload",
      requestModel,
      this.createStateForUploadSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createStateForUpload(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createStateForUploadSectionFields = [];
      if (
        !this.doAfterSave(
          "createStateForUpload",
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
      this.router.navigate(["/in/retrieve-state-for-upload"], {
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
          "createStateForUpload",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateStateForUploadButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createStateForUpload")
      this.createStateForUploadLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createStateForUpload") {
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
    let apiFieldList = [...this.createStateForUploadSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createStateForUploadSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
