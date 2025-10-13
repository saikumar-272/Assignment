import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateAssetRequestModel} from "src/app/shared/interfaces/dto/template-app/asset/create-asset";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
  selector: "app-create-asset",
  templateUrl: "./create-asset.component.html",
  styleUrls: ["./create-asset.component.scss"],
  imports: [
    CommonModule,
    RouterModule,
    AdminChildSectionFormComponent,
    NgbModule,
  ],
  standalone: true,
})
export class CreateAssetComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Asset";
  pageErrors: any = [];
  isCreateAssetButtonDisabled = false;
  createAssetSectionFields: any = [];
  createAssetSectionData: any = {};
  createAssetSelectOptionsData: any = {};
  pageComponentReference: any;
  createAssetLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateAssetSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createAsset"];
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
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createAsset",
      this.toastNotificationService,
      this.backendService
    );

    let createAssetRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createAsset",
        this.backendService,
        this.toastNotificationService
      );
    this.createAssetSectionFields = this.getSectionFieldsFromApiRequestParams(
      "CreateAsset",
      createAssetRequestParamList,
      this
    );
    this.setDataToFormOnload(
      "createAsset",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createAsset",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createAsset() {
    this.isCreateAssetButtonDisabled = true;
    this.resetFormErrors("createAsset");
    this.pageErrors = [];
    const requestModel: ICreateAssetRequestModel = {
      name: this.createAssetSectionData["name"],
      description: this.createAssetSectionData["description"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateAssetButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createAsset",
      requestModel,
      this.createAssetSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createAsset(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createAssetSectionFields = [];
      if (
        !this.doAfterSave(
          "createAsset",
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
      this.router.navigate(["/in/update-asset"], {
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
          "createAsset",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateAssetButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createAsset")
      this.createAssetLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createAsset") {
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
    let apiFieldList = [...this.createAssetSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createAssetSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
