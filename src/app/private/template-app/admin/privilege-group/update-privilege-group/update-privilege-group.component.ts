import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IUpdatePrivilegeGroupRequestModel } from "src/app/shared/interfaces/dto/template-app/privilege-group/update-privilege-group";
import { IResponseMessage } from "src/app/shared/interfaces/dto/dto-base";
import { BackendServiceTemplateApp } from "src/app/shared/services/backend.service.template-app";
import { YES_NO_OPTIONS } from "src/app/shared/util/constants";

import { CustomisationService } from "src/app/customisation.service";
import { FormFieldsTemplateAppImplComponent } from "src/app/shared/forms-custom/form-fields-template-app-impl";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { ToastNotificationService } from "src/app/toast-notification-service";

@Component({
  selector: "app-update-privilege-group",
  templateUrl: "./update-privilege-group.component.html",
  styleUrls: ["./update-privilege-group.component.scss"],
  imports: [
    AdminChildSectionFormComponent,
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class UpdatePrivilegeGroupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Privilege Group";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdatePrivilegeGroupButtonDisabled = false;
  updatePrivilegeGroupSectionFields: any = [];
  updatePrivilegeGroupSectionData: any = {};
  updatePrivilegeGroupSelectOptionsData: any = {};
  updatePrivilegeGroupSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updatePrivilegeGroupLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedPrivilegeGroupUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdatePrivilegeGroupSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updatePrivilegeGroup"];
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
      this.selectedPrivilegeGroupUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updatePrivilegeGroup";
    if (
      this.selectedPrivilegeGroupUUID &&
      this.selectedPrivilegeGroupUUID.length > 0
    ) {
      this.retrievedDataObject =
        await this.backendService.retrievePrivilegeGroup(
          this.selectedPrivilegeGroupUUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updatePrivilegeGroup",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updatePrivilegeGroupRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updatePrivilegeGroup",
          this.backendService,
          this.toastNotificationService
        );
      this.updatePrivilegeGroupSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdatePrivilegeGroup",
          updatePrivilegeGroupRequestParamList,
          this
        );
      this.modifyData(
        "updatePrivilegeGroup",
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
      this.updatePrivilegeGroupSectionData = retrievedObjectInfo;
      this.updatePrivilegeGroupLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updatePrivilegeGroup",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded(
        "updatePrivilegeGroup",
        this,
        retrievedObjectInfo
      );
    }, 100);
  }
  async updatePrivilegeGroup() {
    this.isUpdatePrivilegeGroupButtonDisabled = true;
    this.resetFormErrors("updatePrivilegeGroup");
    this.pageErrors = [];
    const requestModel: IUpdatePrivilegeGroupRequestModel = {
      privilegeGroupUUID: this.selectedPrivilegeGroupUUID,
      name: this.updatePrivilegeGroupSectionData["name"],
      description: this.updatePrivilegeGroupSectionData["description"],
    };
    this.getUpdatedPayload(
      "updatePrivilegeGroup",
      requestModel,
      this.updatePrivilegeGroupSectionData,
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
      this.isUpdatePrivilegeGroupButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updatePrivilegeGroup(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updatePrivilegeGroup",
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
      // window.location.reload();
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
          "updatePrivilegeGroup",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdatePrivilegeGroupButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updatePrivilegeGroup")
      this.updatePrivilegeGroupLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updatePrivilegeGroup") {
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
    let apiFieldList = [...this.updatePrivilegeGroupSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updatePrivilegeGroupSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
