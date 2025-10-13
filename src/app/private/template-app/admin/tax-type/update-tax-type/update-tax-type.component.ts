import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateTaxTypeRequestModel} from "src/app/shared/interfaces/dto/template-app/tax-type/update-tax-type";
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-update-tax-type",
 imports: [RouterModule, AdminChildSectionFormComponent, CommonModule, NgbModule],
  templateUrl: "./update-tax-type.component.html",
  styleUrls: ["./update-tax-type.component.scss"],
  standalone: true
})
export class UpdateTaxTypeComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Tax Type";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateTaxTypeButtonDisabled = false;
  updateTaxTypeSectionFields: any = [];
  updateTaxTypeSectionData: any = {};
  updateTaxTypeSelectOptionsData: any = {};
  updateTaxTypeSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateTaxTypeLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedTaxTypeUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateTaxTypeSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateTaxType"];
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
      this.selectedTaxTypeUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateTaxType";
    if (this.selectedTaxTypeUUID && this.selectedTaxTypeUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveTaxType(
        this.selectedTaxTypeUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateTaxType",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateTaxTypeRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateTaxType",
          this.backendService,
          this.toastNotificationService
        );
      this.updateTaxTypeSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateTaxType",
          updateTaxTypeRequestParamList,
          this
        );
      this.modifyData(
        "updateTaxType",
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
      this.updateTaxTypeSectionData = retrievedObjectInfo;
      this.updateTaxTypeLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateTaxType",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateTaxType", this, retrievedObjectInfo);
    }, 100);
  }
  async updateTaxType() {
    this.isUpdateTaxTypeButtonDisabled = true;
    this.resetFormErrors("updateTaxType");
    this.pageErrors = [];
    const requestModel: IUpdateTaxTypeRequestModel = {
      taxTypeUUID: this.selectedTaxTypeUUID,
      name: this.updateTaxTypeSectionData["name"],
      description: this.updateTaxTypeSectionData["description"],
    };
    this.getUpdatedPayload(
      "updateTaxType",
      requestModel,
      this.updateTaxTypeSectionData,
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
      this.isUpdateTaxTypeButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateTaxType(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateTaxType",
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
          "updateTaxType",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateTaxTypeButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateTaxType")
      this.updateTaxTypeLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateTaxType") {
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
    let apiFieldList = [...this.updateTaxTypeSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateTaxTypeSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
