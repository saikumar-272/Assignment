import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateSectionRequestModel} from "src/app/shared/interfaces/dto/template-app/section/create-section";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";

import {ToastNotificationService} from "src/app/toast-notification-service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-create-section",
  templateUrl: "./create-section.component.html",
  styleUrls: ["./create-section.component.scss"],
  imports: [BrowserAnimationsModule, AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class CreateSectionComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Section";
  pageErrors: any = [];
  isCreateSectionButtonDisabled = false;
  createSectionSectionFields: any = [];
  createSectionSectionData: any = {};
  createSectionSelectOptionsData: any = {};
  pageComponentReference: any;
  createSectionLookupDisplayTextMap: any = {};

  createSection_classInfoList: any[];
  selected_createSection_classInfoUUID: string;
  sectionsShowHideInfo = {
    enableCreateSectionSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createSection"];
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
    this.createSection_classInfoList = [];
    this.selected_createSection_classInfoUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createSection",
      this.toastNotificationService,
      this.backendService
    );

    let createSectionRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createSection",
        this.backendService,
        this.toastNotificationService
      );
    this.createSectionSectionFields = this.getSectionFieldsFromApiRequestParams(
      "CreateSection",
      createSectionRequestParamList,
      this
    );
    this.setDataToFormOnload(
      "createSection",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createSection",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createSection() {
    this.isCreateSectionButtonDisabled = true;
    this.resetFormErrors("createSection");
    this.pageErrors = [];
    const requestModel: ICreateSectionRequestModel = {
      classInfoUUID: this.createSectionSectionData["classInfoUUID"],
      name: this.createSectionSectionData["name"],
      description: this.createSectionSectionData["description"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateSectionButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createSection",
      requestModel,
      this.createSectionSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createSection(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createSectionSectionFields = [];
      if (
        !this.doAfterSave(
          "createSection",
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
      this.router.navigate(["/in/retrieve-section"], {
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
          "createSection",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateSectionButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createSection")
      this.createSectionLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createSection") {
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
    let apiFieldList = [...this.createSectionSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createSectionSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
