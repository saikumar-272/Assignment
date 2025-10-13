import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateSellerRequestModel} from "src/app/shared/interfaces/dto/template-app/seller/update-seller";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-update-seller",
  templateUrl: "./update-seller.component.html",
  styleUrls: ["./update-seller.component.scss"],
  imports: [BrowserAnimationsModule, AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateSellerComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Seller";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateSellerButtonDisabled = false;
  updateSellerSectionFields: any = [];
  updateSellerSectionData: any = {};
  updateSellerSelectOptionsData: any = {};
  updateSellerSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateSellerLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedSellerUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateSellerSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateSeller"];
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
      this.selectedSellerUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateSeller";
    if (this.selectedSellerUUID && this.selectedSellerUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveSeller(
        this.selectedSellerUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateSeller",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateSellerRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateSeller",
          this.backendService,
          this.toastNotificationService
        );
      this.updateSellerSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateSeller",
          updateSellerRequestParamList,
          this
        );
      this.modifyData(
        "updateSeller",
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
      this.updateSellerSectionData = retrievedObjectInfo;
      this.updateSellerLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateSeller",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateSeller", this, retrievedObjectInfo);
    }, 100);
  }
  async updateSeller() {
    this.isUpdateSellerButtonDisabled = true;
    this.resetFormErrors("updateSeller");
    this.pageErrors = [];
    const requestModel: IUpdateSellerRequestModel = {
      sellerUUID: this.selectedSellerUUID,
      firstName: this.updateSellerSectionData["firstName"],
      lastName: this.updateSellerSectionData["lastName"],
      dispatchAddress: this.updateSellerSectionData["dispatchAddress"],
    };
    this.getUpdatedPayload(
      "updateSeller",
      requestModel,
      this.updateSellerSectionData,
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
      this.isUpdateSellerButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateSeller(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateSeller",
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
          "updateSeller",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateSellerButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateSeller")
      this.updateSellerLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateSeller") {
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
    let apiFieldList = [...this.updateSellerSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateSellerSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
