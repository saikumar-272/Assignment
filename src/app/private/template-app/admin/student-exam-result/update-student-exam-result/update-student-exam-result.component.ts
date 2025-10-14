import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateStudentExamResultRequestModel
} from "src/app/shared/interfaces/dto/template-app/student-exam-result/update-student-exam-result";
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
selector: "app-update-student-exam-result",
  imports: [RouterModule, CommonModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],

  templateUrl: "./update-student-exam-result.component.html",
  styleUrls: ["./update-student-exam-result.component.scss"],
  standalone: true
})
export class UpdateStudentExamResultComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Student Exam Result";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateStudentExamResultButtonDisabled = false;
  updateStudentExamResultSectionFields: any = [];
  updateStudentExamResultSectionData: any = {};
  updateStudentExamResultSelectOptionsData: any = {};
  updateStudentExamResultSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateStudentExamResultLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedStudentExamResultUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateStudentExamResultSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateStudentExamResult"];
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
      this.selectedStudentExamResultUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateStudentExamResult";
    if (
      this.selectedStudentExamResultUUID &&
      this.selectedStudentExamResultUUID.length > 0
    ) {
      this.retrievedDataObject =
        await this.backendService.retrieveStudentExamResult(
          this.selectedStudentExamResultUUID
        );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateStudentExamResult",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateStudentExamResultRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateStudentExamResult",
          this.backendService,
          this.toastNotificationService
        );
      this.updateStudentExamResultSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateStudentExamResult",
          updateStudentExamResultRequestParamList,
          this
        );
      this.modifyData(
        "updateStudentExamResult",
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
      this.updateStudentExamResultSectionData = retrievedObjectInfo;
      this.updateStudentExamResultLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateStudentExamResult",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded(
        "updateStudentExamResult",
        this,
        retrievedObjectInfo
      );
    }, 100);
  }
  async updateStudentExamResult() {
    this.isUpdateStudentExamResultButtonDisabled = true;
    this.resetFormErrors("updateStudentExamResult");
    this.pageErrors = [];
    const requestModel: IUpdateStudentExamResultRequestModel = {
      studentExamResultUUID: this.selectedStudentExamResultUUID,
      studentUUID: this.updateStudentExamResultSectionData["studentUUID"],
      examName: this.updateStudentExamResultSectionData["examName"],
      marks: this.updateStudentExamResultSectionData["marks"],
    };
    this.getUpdatedPayload(
      "updateStudentExamResult",
      requestModel,
      this.updateStudentExamResultSectionData,
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
      this.isUpdateStudentExamResultButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateStudentExamResult(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateStudentExamResult",
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
          "updateStudentExamResult",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateStudentExamResultButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateStudentExamResult")
      this.updateStudentExamResultLookupDisplayTextMap[fieldKey] =
        selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateStudentExamResult") {
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
    let apiFieldList = [...this.updateStudentExamResultSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateStudentExamResultSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["studentUUID"])) {
      this.updateStudentExamResultSelectedLookupsDataListObj["studentUUID"] =
        of([
          {
            id: retrievedObjectInfo["studentUUID"],
            value: retrievedObjectInfo["studentDisplayText"],
          }]);
    }
  }

  updateSelectOptionsData() {}
}
