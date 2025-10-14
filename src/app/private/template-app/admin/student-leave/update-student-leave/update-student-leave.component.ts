import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IRetrieveStudentLeaveDto } from "src/app/shared/interfaces/dto/template-app/student-leave/retrieve-student-leave";
import { IUpdateStudentLeaveRequestModel } from "src/app/shared/interfaces/dto/template-app/student-leave/update-student-leave";
import { IResponseMessage } from "src/app/shared/interfaces/dto/dto-base";
import { BackendServiceTemplateApp } from "src/app/shared/services/backend.service.template-app";
import { YES_NO_OPTIONS } from "src/app/shared/util/constants";

import { CustomisationService } from "src/app/customisation.service";
import { FormFieldsTemplateAppImplComponent } from "src/app/shared/forms-custom/form-fields-template-app-impl";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { ToastNotificationService } from "src/app/toast-notification-service";

@Component({
  selector: "app-update-student-leave",
  templateUrl: "./update-student-leave.component.html",
  styleUrls: ["./update-student-leave.component.scss"],
  imports: [
    CommonModule,
    RouterModule,
    AdminChildSectionFormComponent,
    NgbModule,
  ],
  standalone: true,
})
export class UpdateStudentLeaveComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit StudentLeave";
  pageErrors: any = [];
  isUpdateStudentLeaveButtonDisabled = false;
  updateStudentLeaveSectionFields: any = [];
  updateStudentLeaveSectionData: any = {};
  updateStudentLeaveSelectOptionsData: any = {};
  updateStudentLeaveSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateStudentLeaveLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedStudentLeaveUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateStudentLeaveSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateStudentLeave"];
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
      this.selectedStudentLeaveUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateStudentLeave";
    if (
      this.selectedStudentLeaveUUID &&
      this.selectedStudentLeaveUUID.length > 0
    ) {
      let retrievedObjectInfo: IRetrieveStudentLeaveDto =
        await this.backendService.retrieveStudentLeave(
          this.selectedStudentLeaveUUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateStudentLeave",
        this.toastNotificationService,
        this.backendService,
        retrievedObjectInfo
      );
      this.setSelectedLookupsDataIntoObj(retrievedObjectInfo);
      let updateStudentLeaveRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateStudentLeave",
          this.backendService,
          this.toastNotificationService
        );
      this.updateStudentLeaveSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateStudentLeave",
          updateStudentLeaveRequestParamList,
          this
        );
      this.modifyData(
        "updateStudentLeave",
        retrievedObjectInfo,
        this.additionalProperties,
        this.toastNotificationService,
        this.backendService
      );
      this.setRetrievedObjectInfo(retrievedObjectInfo, pageApiName);
    }
  }

  setRetrievedObjectInfo(
    retrievedObjectInfo: IRetrieveStudentLeaveDto,
    pageApiName: any
  ) {
    setTimeout(() => {
      this.updateStudentLeaveSectionData = retrievedObjectInfo;
      this.updateStudentLeaveLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateStudentLeave",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateStudentLeave", this, retrievedObjectInfo);
    }, 100);
  }
  async updateStudentLeave() {
    this.isUpdateStudentLeaveButtonDisabled = true;
    this.resetFormErrors("updateStudentLeave");
    this.pageErrors = [];
    const requestModel: IUpdateStudentLeaveRequestModel = {
      studentLeaveUUID: this.selectedStudentLeaveUUID,
      name: this.updateStudentLeaveSectionData["name"],
      leaveDate: this.updateStudentLeaveSectionData["leaveDate"],
      reason: this.updateStudentLeaveSectionData["reason"],
    };
    this.getUpdatedPayload(
      "updateStudentLeave",
      requestModel,
      this.updateStudentLeaveSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateStudentLeaveButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateStudentLeave(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateStudentLeave",
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
          "updateStudentLeave",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateStudentLeaveButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateStudentLeave")
      this.updateStudentLeaveLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {}

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {}

  hideSectionField(key: string) {
    let apiFieldList = [...this.updateStudentLeaveSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateStudentLeaveSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
