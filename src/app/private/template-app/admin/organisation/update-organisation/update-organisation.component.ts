import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateOrganisationRequestModel
} from "src/app/shared/interfaces/dto/template-app/organisation/update-organisation";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-update-organisation",
  templateUrl: "./update-organisation.component.html",
  styleUrls: ["./update-organisation.component.scss"],
  imports: [AdminChildSectionFormComponent, BrowserAnimationsModule, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateOrganisationComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Organisation";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateOrganisationButtonDisabled = false;
  updateOrganisationSectionFields: any = [];
  updateOrganisationSectionData: any = {};
  updateOrganisationSelectOptionsData: any = {};
  updateOrganisationSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateOrganisationLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedOrganisationUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateOrganisationSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateOrganisation"];
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
      this.selectedOrganisationUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateOrganisation";
    if (
      this.selectedOrganisationUUID &&
      this.selectedOrganisationUUID.length > 0
    ) {
      this.retrievedDataObject = await this.backendService.retrieveOrganisation(
        this.selectedOrganisationUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateOrganisation",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateOrganisationRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateOrganisation",
          this.backendService,
          this.toastNotificationService
        );
      this.updateOrganisationSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateOrganisation",
          updateOrganisationRequestParamList,
          this
        );
      this.modifyData(
        "updateOrganisation",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      setTimeout(() => {
        this.updateDisplayPropertyOfApiParameterDependentFields(
          "updateOrganisation",
          this.retrievedDataObject,
          this.pageSectionNameList,
          this
        );
      }, 100);
    }
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.updateOrganisationSectionData = retrievedObjectInfo;
      this.updateOrganisationLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateOrganisation",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateOrganisation", this, retrievedObjectInfo);
    }, 100);
  }
  async updateOrganisation() {
    this.isUpdateOrganisationButtonDisabled = true;
    this.resetFormErrors("updateOrganisation");
    this.pageErrors = [];
    const requestModel: IUpdateOrganisationRequestModel = {
      organisationUUID: this.selectedOrganisationUUID,
      name: this.updateOrganisationSectionData["name"],
      emailId: this.updateOrganisationSectionData["emailId"],
      contactNo: this.updateOrganisationSectionData["contactNo"],
      isCommissionAgent: this.getBooleanParameterValue(
        this.updateOrganisationSectionData["isCommissionAgent"]
      ),
      commissionAgentName:
        this.updateOrganisationSectionData["commissionAgentName"],
      isFranchisee: this.getBooleanParameterValue(
        this.updateOrganisationSectionData["isFranchisee"]
      ),
      franchiseeName: this.updateOrganisationSectionData["franchiseeName"],
    };
    this.getUpdatedPayload(
      "updateOrganisation",
      requestModel,
      this.updateOrganisationSectionData,
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
      this.isUpdateOrganisationButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateOrganisation(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateOrganisation",
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
          "updateOrganisation",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateOrganisationButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateOrganisation")
      this.updateOrganisationLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateOrganisation") {
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
    let apiFieldList = [...this.updateOrganisationSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateOrganisationSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
