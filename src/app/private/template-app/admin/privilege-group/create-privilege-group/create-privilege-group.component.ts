import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreatePrivilegeGroupRequestModel
} from "src/app/shared/interfaces/dto/template-app/privilege-group/create-privilege-group";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-create-privilege-group",
  templateUrl: "./create-privilege-group.component.html",
  styleUrls: ["./create-privilege-group.component.scss"],
  imports: [AdminChildSectionFormComponent, BrowserAnimationsModule, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class CreatePrivilegeGroupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Privilege Group";
  pageErrors: any = [];
  isCreatePrivilegeGroupButtonDisabled = false;
  createPrivilegeGroupSectionFields: any = [];
  createPrivilegeGroupSectionData: any = {};
  createPrivilegeGroupSelectOptionsData: any = {};
  pageComponentReference: any;
  createPrivilegeGroupLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreatePrivilegeGroupSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createPrivilegeGroup"];
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
      "createPrivilegeGroup",
      this.toastNotificationService,
      this.backendService
    );

    let createPrivilegeGroupRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createPrivilegeGroup",
        this.backendService,
        this.toastNotificationService
      );
    this.createPrivilegeGroupSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreatePrivilegeGroup",
        createPrivilegeGroupRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createPrivilegeGroup",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createPrivilegeGroup",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createPrivilegeGroup() {
    this.isCreatePrivilegeGroupButtonDisabled = true;
    this.resetFormErrors("createPrivilegeGroup");
    this.pageErrors = [];
    const requestModel: ICreatePrivilegeGroupRequestModel = {
      name: this.createPrivilegeGroupSectionData["name"],
      description: this.createPrivilegeGroupSectionData["description"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreatePrivilegeGroupButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createPrivilegeGroup",
      requestModel,
      this.createPrivilegeGroupSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createPrivilegeGroup(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createPrivilegeGroupSectionFields = [];
      if (
        !this.doAfterSave(
          "createPrivilegeGroup",
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
      this.router.navigate(["/in/retrieve-privilege-group"], {
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
          "createPrivilegeGroup",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreatePrivilegeGroupButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createPrivilegeGroup")
      this.createPrivilegeGroupLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createPrivilegeGroup") {
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
    let apiFieldList = [...this.createPrivilegeGroupSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createPrivilegeGroupSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
