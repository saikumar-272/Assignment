import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateSectionRequestModel} from "src/app/shared/interfaces/dto/template-app/section/update-section";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {isBlank} from "src/app/shared/util/string-util";
import {of} from "rxjs";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";

@Component({
selector: "app-update-section",
  templateUrl: "./update-section.component.html",
  styleUrls: ["./update-section.component.scss"],
  imports: [ AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdateSectionComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Section";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateSectionButtonDisabled = false;
  updateSectionSectionFields: any = [];
  updateSectionSectionData: any = {};
  updateSectionSelectOptionsData: any = {};
  updateSectionSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateSectionLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedSectionUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateSectionSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateSection"];
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
      this.selectedSectionUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateSection";
    if (this.selectedSectionUUID && this.selectedSectionUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveSection(
        this.selectedSectionUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateSection",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateSectionRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateSection",
          this.backendService,
          this.toastNotificationService
        );
      this.updateSectionSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateSection",
          updateSectionRequestParamList,
          this
        );
      this.modifyData(
        "updateSection",
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
      this.updateSectionSectionData = retrievedObjectInfo;
      this.updateSectionLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateSection",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateSection", this, retrievedObjectInfo);
    }, 100);
  }
  async updateSection() {
    this.isUpdateSectionButtonDisabled = true;
    this.resetFormErrors("updateSection");
    this.pageErrors = [];
    const requestModel: IUpdateSectionRequestModel = {
      sectionUUID: this.selectedSectionUUID,
      classInfoUUID: this.updateSectionSectionData["classInfoUUID"],
      name: this.updateSectionSectionData["name"],
      description: this.updateSectionSectionData["description"],
    };
    this.getUpdatedPayload(
      "updateSection",
      requestModel,
      this.updateSectionSectionData,
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
      this.isUpdateSectionButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateSection(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateSection",
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
          "updateSection",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateSectionButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateSection")
      this.updateSectionLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateSection") {
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
    let apiFieldList = [...this.updateSectionSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateSectionSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["classInfoUUID"])) {
      this.updateSectionSelectedLookupsDataListObj["classInfoUUID"] = of([
        {
          id: retrievedObjectInfo["classInfoUUID"],
          value: retrievedObjectInfo["classInfoDisplayText"],
        }]);
    }
  }

  updateSelectOptionsData() {}
}
