import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import {
    IUpdateSalesInvoice2RequestModel
} from "src/app/shared/interfaces/dto/template-app/sales-invoice2/update-sales-invoice2";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {
    RetrieveEmpLocationListSearchPopupComponent
} from "src/app/private/admin/searchpopups/emp-location/retrieve-emp-location-list/retrieve-emp-location-list-search-popup.component";
import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {isBlank} from "src/app/shared/util/string-util";
import {of} from "rxjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-update-sales-invoice2",
  templateUrl: "./update-sales-invoice2.component.html",
  styleUrls: ["./update-sales-invoice2.component.scss"],
  imports: [BrowserAnimationsModule, AdminChildSectionFormComponent, RetrieveEmpLocationListSearchPopupComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateSalesInvoice2Component
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Sales Invoice2";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateSalesInvoice2ButtonDisabled = false;
  updateSalesInvoice2SectionFields: any = [];
  updateSalesInvoice2SectionData: any = {};
  updateSalesInvoice2SelectOptionsData: any = {};
  updateSalesInvoice2SelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateSalesInvoice2LookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedSalesInvoice2UUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateSalesInvoice2Section: true,
  };
  lineItemsSectionsShowHideInfo = {};
  @ViewChild("retrieveEmpLocationListSearchPopupCompRef")
  retrieveEmpLocationListSearchPopupCompRef!: RetrieveEmpLocationListSearchPopupComponent;
  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateSalesInvoice2"];
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
      this.selectedSalesInvoice2UUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateSalesInvoice2";
    if (
      this.selectedSalesInvoice2UUID &&
      this.selectedSalesInvoice2UUID.length > 0
    ) {
      this.retrievedDataObject =
        await this.backendService.retrieveSalesInvoice2(
          this.selectedSalesInvoice2UUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateSalesInvoice2",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateSalesInvoice2RequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateSalesInvoice2",
          this.backendService,
          this.toastNotificationService
        );
      this.updateSalesInvoice2SectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateSalesInvoice2",
          updateSalesInvoice2RequestParamList,
          this
        );
      this.modifyData(
        "updateSalesInvoice2",
        this.retrievedDataObject,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);

      setTimeout(() => {
        this.updateDisplayPropertyOfApiParameterDependentFields(
          "updateSalesInvoice2",
          this.retrievedDataObject,
          this.pageSectionNameList,
          this
        );
      }, 100);
    }
  }

  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any) {
    setTimeout(() => {
      this.updateSalesInvoice2SectionData = retrievedObjectInfo;
      this.updateSalesInvoice2LookupDisplayTextMap = {};
      this.updateSalesInvoice2LookupDisplayTextMap["location1UUID"] = isBlank(
        retrievedObjectInfo["location1DisplayText"]
      )
        ? ""
        : retrievedObjectInfo["location1DisplayText"];
      document
        .getElementById("update-sales-invoice2-form")
        ?.querySelector("#location1UUID")
        ?.setAttribute(
          "value",
          this.updateSalesInvoice2LookupDisplayTextMap["location1UUID"]
        );
      this.doAfterPageDataLoaded(
        "updateSalesInvoice2",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateSalesInvoice2", this, retrievedObjectInfo);
    }, 100);
  }
  async updateSalesInvoice2() {
    this.isUpdateSalesInvoice2ButtonDisabled = true;
    this.resetFormErrors("updateSalesInvoice2");
    this.pageErrors = [];
    const requestModel: IUpdateSalesInvoice2RequestModel = {
      salesInvoice2UUID: this.selectedSalesInvoice2UUID,
      invoiceNo: this.updateSalesInvoice2SectionData["invoiceNo"],
      location1UUID: this.updateSalesInvoice2SectionData["location1UUID"],
      invoiceDate: this.updateSalesInvoice2SectionData["invoiceDate"],
      buyerType: this.getComboParameterValue(
        this.updateSalesInvoice2SectionData["buyerType"]
      ),
      organisationUUID: this.updateSalesInvoice2SectionData["organisationUUID"],
      personUUID: this.updateSalesInvoice2SectionData["personUUID"],
      buyerUUID: this.updateSalesInvoice2SectionData["buyerUUID"],
    };
    this.getUpdatedPayload(
      "updateSalesInvoice2",
      requestModel,
      this.updateSalesInvoice2SectionData,
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
      this.isUpdateSalesInvoice2ButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateSalesInvoice2(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateSalesInvoice2",
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
          "updateSalesInvoice2",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateSalesInvoice2ButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateSalesInvoice2")
      this.updateSalesInvoice2LookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateSalesInvoice2") {
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
    let apiFieldList = [...this.updateSalesInvoice2SectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateSalesInvoice2SectionFields];
    this.displayAField(key, apiFieldList);
  }

  openSearchPopupInParent(event: any) {
    var fieldKey = event.fieldKey;
    var sectionName = event.sectionName;
    if (sectionName) {
      sectionName = this.toInitLower(sectionName);
    }
    this.openSearchPopup(fieldKey, sectionName);
  }

  openSearchPopup(fieldName: string, sectionName: string) {
    if (1 > 2) {
    } else if (
      fieldName == "location1UUID" &&
      sectionName == "updateSalesInvoice2"
    ) {
      this.retrieveEmpLocationListSearchPopupCompRef.showRetrieveEmpLocationListSearchPopup(
        "updateSalesInvoice2",
        fieldName
      );
    }
  }

  setSearchPopupValue(selectedLookupData: any) {
    let processingSectionName = selectedLookupData["processingSectionName"];
    let processingFieldName = selectedLookupData["processingFieldName"];
    let dataObject: any = {};
    dataObject[processingFieldName] = selectedLookupData["id"];
    this.setSelectedSearchPopupData(
      processingFieldName,
      processingSectionName,
      dataObject,
      selectedLookupData["displayText"]
    );
  }

  setSelectedSearchPopupData(
    processingFieldName: string,
    processingSectionName: any,
    dataObject: any,
    displayText: string
  ) {
    if (1 > 2) {
    } else if (processingSectionName == "updateSalesInvoice2") {
      this.updateSalesInvoice2SectionData[processingFieldName] =
        dataObject[processingFieldName];
      this.updateSalesInvoice2LookupDisplayTextMap[processingFieldName] =
        displayText;
      document
        .getElementById("update-sales-invoice2-form")
        ?.querySelector("#" + processingFieldName + "")
        ?.setAttribute("value", displayText);
    }
  }
  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["organisationUUID"])) {
      this.updateSalesInvoice2SelectedLookupsDataListObj["organisationUUID"] =
        of([
          {
            id: retrievedObjectInfo["organisationUUID"],
            value: retrievedObjectInfo["organisationDisplayText"],
          },
        ]);
    }
    if (!isBlank(retrievedObjectInfo["personUUID"])) {
      this.updateSalesInvoice2SelectedLookupsDataListObj["personUUID"] = of([
        {
          id: retrievedObjectInfo["personUUID"],
          value: retrievedObjectInfo["personDisplayText"],
        },
      ]);
    }
  }

  updateSelectOptionsData() {
    this.updateSalesInvoice2SelectOptionsData["buyerType"] =
      OptionsList.BuyerType;
  }
}
