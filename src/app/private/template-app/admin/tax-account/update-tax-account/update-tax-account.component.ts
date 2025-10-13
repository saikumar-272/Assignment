import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateTaxAccountRequestModel} from "src/app/shared/interfaces/dto/template-app/tax-account/update-tax-account";
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
selector: "app-update-tax-account",
  imports: [RouterModule, AdminChildSectionFormComponent, CommonModule, NgbModule],
  templateUrl: "./update-tax-account.component.html",
  styleUrls: ["./update-tax-account.component.scss"],
  standalone: true
})
export class UpdateTaxAccountComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Tax Account";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateTaxAccountButtonDisabled = false;
  updateTaxAccountSectionFields: any = [];
  updateTaxAccountSectionData: any = {};
  updateTaxAccountSelectOptionsData: any = {};
  updateTaxAccountSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateTaxAccountLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedTaxAccountUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateTaxAccountSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateTaxAccount"];
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
      this.selectedTaxAccountUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateTaxAccount";
    if (this.selectedTaxAccountUUID && this.selectedTaxAccountUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveTaxAccount(
        this.selectedTaxAccountUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateTaxAccount",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateTaxAccountRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateTaxAccount",
          this.backendService,
          this.toastNotificationService
        );
      this.updateTaxAccountSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateTaxAccount",
          updateTaxAccountRequestParamList,
          this
        );
      this.modifyData(
        "updateTaxAccount",
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
      this.updateTaxAccountSectionData = retrievedObjectInfo;
      this.updateTaxAccountLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateTaxAccount",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateTaxAccount", this, retrievedObjectInfo);
    }, 100);
  }
  async updateTaxAccount() {
    this.isUpdateTaxAccountButtonDisabled = true;
    this.resetFormErrors("updateTaxAccount");
    this.pageErrors = [];
    const requestModel: IUpdateTaxAccountRequestModel = {
      taxAccountUUID: this.selectedTaxAccountUUID,
      name: this.updateTaxAccountSectionData["name"],
      taxTypeUUID: this.updateTaxAccountSectionData["taxTypeUUID"],
    };
    this.getUpdatedPayload(
      "updateTaxAccount",
      requestModel,
      this.updateTaxAccountSectionData,
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
      this.isUpdateTaxAccountButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateTaxAccount(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateTaxAccount",
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
          "updateTaxAccount",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateTaxAccountButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateTaxAccount")
      this.updateTaxAccountLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateTaxAccount") {
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
    let apiFieldList = [...this.updateTaxAccountSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateTaxAccountSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["taxTypeUUID"])) {
      this.updateTaxAccountSelectedLookupsDataListObj["taxTypeUUID"] = of([
        {
          id: retrievedObjectInfo["taxTypeUUID"],
          value: retrievedObjectInfo["taxTypeDisplayText"],
        }]);
    }
  }

  updateSelectOptionsData() {}
}
