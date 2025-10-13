import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateStudentExamResultRequestModel
} from "src/app/shared/interfaces/dto/template-app/student-exam-result/create-student-exam-result";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-student-exam-result",
  imports: [RouterModule, CommonModule, AdminChildSectionFormComponent, NgbModule],
  templateUrl: "./create-student-exam-result.component.html",
  styleUrls: ["./create-student-exam-result.component.scss"],
  standalone: true
})
export class CreateStudentExamResultComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Student Exam Result";
  pageErrors: any = [];
  isCreateStudentExamResultButtonDisabled = false;
  createStudentExamResultSectionFields: any = [];
  createStudentExamResultSectionData: any = {};
  createStudentExamResultSelectOptionsData: any = {};
  pageComponentReference: any;
  createStudentExamResultLookupDisplayTextMap: any = {};

  createStudentExamResult_studentList: any[];
  selected_createStudentExamResult_studentUUID: string;
  sectionsShowHideInfo = {
    enableCreateStudentExamResultSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createStudentExamResult"];
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
    this.createStudentExamResult_studentList = [];
    this.selected_createStudentExamResult_studentUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createStudentExamResult",
      this.toastNotificationService,
      this.backendService
    );

    let createStudentExamResultRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createStudentExamResult",
        this.backendService,
        this.toastNotificationService
      );
    this.createStudentExamResultSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateStudentExamResult",
        createStudentExamResultRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createStudentExamResult",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createStudentExamResult",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createStudentExamResult() {
    this.isCreateStudentExamResultButtonDisabled = true;
    this.resetFormErrors("createStudentExamResult");
    this.pageErrors = [];
    const requestModel: ICreateStudentExamResultRequestModel = {
      studentUUID: this.createStudentExamResultSectionData["studentUUID"],
      examName: this.createStudentExamResultSectionData["examName"],
      marks: this.createStudentExamResultSectionData["marks"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateStudentExamResultButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createStudentExamResult",
      requestModel,
      this.createStudentExamResultSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createStudentExamResult(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createStudentExamResultSectionFields = [];
      if (
        !this.doAfterSave(
          "createStudentExamResult",
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
      this.router.navigate(["/in/retrieve-student-exam-result"], {
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
          "createStudentExamResult",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateStudentExamResultButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createStudentExamResult")
      this.createStudentExamResultLookupDisplayTextMap[fieldKey] =
        selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createStudentExamResult") {
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
    let apiFieldList = [...this.createStudentExamResultSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createStudentExamResultSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
