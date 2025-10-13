import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateOrganisationRequestModel
} from "src/app/shared/interfaces/dto/template-app/organisation/create-organisation";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
@Component({
selector: "app-create-organisation",
  templateUrl: "./create-organisation.component.html",
  styleUrls: ["./create-organisation.component.scss"],
  imports: [ AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class CreateOrganisationComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Organisation";
  pageErrors: any = [];
  isCreateOrganisationButtonDisabled = false;
  createOrganisationSectionFields: any = [];
  createOrganisationSectionData: any = {};
  createOrganisationSelectOptionsData: any = {};
  pageComponentReference: any;
  createOrganisationLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateOrganisationSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createOrganisation"];
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
      "createOrganisation",
      this.toastNotificationService,
      this.backendService
    );

    let createOrganisationRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createOrganisation",
        this.backendService,
        this.toastNotificationService
      );
    this.createOrganisationSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateOrganisation",
        createOrganisationRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createOrganisation",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createOrganisation",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createOrganisation() {
    this.isCreateOrganisationButtonDisabled = true;
    this.resetFormErrors("createOrganisation");
    this.pageErrors = [];
    const requestModel: ICreateOrganisationRequestModel = {
      name: this.createOrganisationSectionData["name"],
      emailId: this.createOrganisationSectionData["emailId"],
      contactNo: this.createOrganisationSectionData["contactNo"],
      isCommissionAgent: this.getBooleanParameterValue(
        this.createOrganisationSectionData["isCommissionAgent"]
      ),
      commissionAgentName:
        this.createOrganisationSectionData["commissionAgentName"],
      isFranchisee: this.getBooleanParameterValue(
        this.createOrganisationSectionData["isFranchisee"]
      ),
      franchiseeName: this.createOrganisationSectionData["franchiseeName"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateOrganisationButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createOrganisation",
      requestModel,
      this.createOrganisationSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createOrganisation(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createOrganisationSectionFields = [];
      if (
        !this.doAfterSave(
          "createOrganisation",
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
      this.router.navigate(["/in/retrieve-organisation"], {
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
          "createOrganisation",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateOrganisationButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createOrganisation")
      this.createOrganisationLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createOrganisation") {
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
    let apiFieldList = [...this.createOrganisationSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createOrganisationSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
