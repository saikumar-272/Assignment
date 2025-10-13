import {
    ParentChildSectionFormComponent
} from 'src/app/shared/parent/child-section-forms/parent-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateStudentLeaveRequestModel
} from "src/app/shared/interfaces/dto/template-app/student-leave/create-student-leave";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-student-leave",
  imports: [CommonModule, ParentChildSectionFormComponent, NgbModule],
  templateUrl: "./create-student-leave.component.html",
  styleUrls: ["./create-student-leave.component.scss"],
  standalone: true
})
export class CreateStudentLeaveComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New StudentLeave";
  pageErrors: any = [];
  isCreateStudentLeaveButtonDisabled = false;
  createStudentLeaveSectionFields: any = [];
  createStudentLeaveSectionData: any = {};
  createStudentLeaveSelectOptionsData: any = {};
  pageComponentReference: any;
  createStudentLeaveLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateStudentLeaveSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createStudentLeave"];
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
      "createStudentLeave",
      this.toastNotificationService,
      this.backendService
    );

    let createStudentLeaveRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createStudentLeave",
        this.backendService,
        this.toastNotificationService
      );
    this.createStudentLeaveSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateStudentLeave",
        createStudentLeaveRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createStudentLeave",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createStudentLeave",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createStudentLeave() {
    this.isCreateStudentLeaveButtonDisabled = true;
    this.resetFormErrors("createStudentLeave");
    this.pageErrors = [];
    const requestModel: ICreateStudentLeaveRequestModel = {
      name: this.createStudentLeaveSectionData["name"],
      leaveDate: this.createStudentLeaveSectionData["leaveDate"],
      reason: this.createStudentLeaveSectionData["reason"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateStudentLeaveButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createStudentLeave",
      requestModel,
      this.createStudentLeaveSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createStudentLeave(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createStudentLeaveSectionFields = [];
      if (
        !this.doAfterSave(
          "createStudentLeave",
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
      this.router.navigate(["/parent/retrieve-student-leave"], {
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
          "createStudentLeave",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateStudentLeaveButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createStudentLeave")
      this.createStudentLeaveLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createStudentLeave") {
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
    let apiFieldList = [...this.createStudentLeaveSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createStudentLeaveSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
