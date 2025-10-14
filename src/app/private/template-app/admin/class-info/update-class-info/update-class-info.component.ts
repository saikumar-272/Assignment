import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IUpdateClassInfoRequestModel } from "src/app/shared/interfaces/dto/template-app/class-info/update-class-info";
import { IResponseMessage } from "src/app/shared/interfaces/dto/dto-base";
import { BackendServiceTemplateApp } from "src/app/shared/services/backend.service.template-app";
import { YES_NO_OPTIONS } from "src/app/shared/util/constants";

import { CustomisationService } from "src/app/customisation.service";
import { FormFieldsTemplateAppImplComponent } from "src/app/shared/forms-custom/form-fields-template-app-impl";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { ToastNotificationService } from "src/app/toast-notification-service";

@Component({
  selector: "app-update-class-info",
  templateUrl: "./update-class-info.component.html",
  styleUrls: ["./update-class-info.component.scss"],
  imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class UpdateClassInfoComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Class";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateClassInfoButtonDisabled = false;
  updateClassInfoSectionFields: any = [];
  updateClassInfoSectionData: any = {};
  updateClassInfoSelectOptionsData: any = {};
  updateClassInfoSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateClassInfoLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedClassInfoUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateClassInfoSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateClassInfo"];
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
      this.selectedClassInfoUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateClassInfo";
    if (this.selectedClassInfoUUID && this.selectedClassInfoUUID.length > 0) {
      this.retrievedDataObject =
        await this.backendService.retrieveClassInfoListForLookup(
          this.selectedClassInfoUUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateClassInfo",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateClassInfoRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateClassInfo",
          this.backendService,
          this.toastNotificationService
        );
      this.updateClassInfoSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateClassInfo",
          updateClassInfoRequestParamList,
          this
        );
      this.modifyData(
        "updateClassInfo",
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
      this.updateClassInfoSectionData = retrievedObjectInfo;
      this.updateClassInfoLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateClassInfo",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateClassInfo", this, retrievedObjectInfo);
    }, 100);
  }
  async updateClassInfo() {
    this.isUpdateClassInfoButtonDisabled = true;
    this.resetFormErrors("updateClassInfo");
    this.pageErrors = [];
    const requestModel: IUpdateClassInfoRequestModel = {
      classInfoUUID: this.selectedClassInfoUUID,
      name: this.updateClassInfoSectionData["name"],
      description: this.updateClassInfoSectionData["description"],
    };
    this.getUpdatedPayload(
      "updateClassInfo",
      requestModel,
      this.updateClassInfoSectionData,
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
      this.isUpdateClassInfoButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateClassInfo(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateClassInfo",
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
          "updateClassInfo",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateClassInfoButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateClassInfo")
      this.updateClassInfoLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateClassInfo") {
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
    let apiFieldList = [...this.updateClassInfoSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateClassInfoSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
