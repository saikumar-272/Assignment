import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateStudentForFlexfieldsRequestModel
} from "src/app/shared/interfaces/dto/template-app/student/create-student-for-flexfields";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-student-for-flexfields",
  imports: [AdminChildSectionFormComponent, CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./create-student-for-flexfields.component.html",
  styleUrls: ["./create-student-for-flexfields.component.scss"],
  standalone: true
})
export class CreateStudentForFlexfieldsComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Create Student For Flexfields";
  pageErrors: any = [];
  isCreateStudentForFlexfieldsButtonDisabled = false;
  section2SectionFields: any = [];
  section2SectionData: any = {};
  section2SelectOptionsData: any = {};
  pageComponentReference: any;
  createStudentForFlexfieldsLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableSection2Section: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["section2"];
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
      "createStudentForFlexfields",
      this.toastNotificationService,
      this.backendService
    );

    let createStudentForFlexfieldsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createStudentForFlexfields",
        this.backendService,
        this.toastNotificationService
      );
    this.section2SectionFields = this.getSectionFieldsFromApiRequestParams(
      "Section2",
      createStudentForFlexfieldsRequestParamList,
      this
    );
    this.setDataToFormOnload(
      "createStudentForFlexfields",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createStudentForFlexfields",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createStudentForFlexfields() {
    this.isCreateStudentForFlexfieldsButtonDisabled = true;
    this.resetFormErrors("createStudentForFlexfields");
    this.pageErrors = [];
    const requestModel: ICreateStudentForFlexfieldsRequestModel = {
      locationContextUUID: this.section2SectionData["locationContextUUID"],
      locationColumn1: this.section2SectionData["locationColumn1"],
      locationColumn2: this.section2SectionData["locationColumn2"],
      locationColumn3: this.section2SectionData["locationColumn3"],
      locationColumn4: this.section2SectionData["locationColumn4"],
      locationColumn5: this.section2SectionData["locationColumn5"],
      degreeTypeContextUUID: this.section2SectionData["degreeTypeContextUUID"],
      degreeTypeColumn1: this.section2SectionData["degreeTypeColumn1"],
      degreeTypeColumn2: this.section2SectionData["degreeTypeColumn2"],
      degreeTypeColumn3: this.section2SectionData["degreeTypeColumn3"],
      degreeTypeColumn4: this.section2SectionData["degreeTypeColumn4"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateStudentForFlexfieldsButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createStudentForFlexfields",
      requestModel,
      this.section2SectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createStudentForFlexfields(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.section2SectionFields = [];
      if (
        !this.doAfterSave(
          "createStudentForFlexfields",
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
          "createStudentForFlexfields",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateStudentForFlexfieldsButtonDisabled = false;
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
    if (field.isFlexfield) {
      this.handleContextFlexFields(selectedRecord?.value, field.flexfieldCode);
    }
  }
  updateLookupDisplayTextMap(
    fieldApiName: string,
    fieldKey: string,
    selectedValue: any
  ) {
    if (this.toInitLower(fieldApiName) === "createStudentForFlexfields")
      this.createStudentForFlexfieldsLookupDisplayTextMap[fieldKey] =
        selectedValue;
  }
  handleContextFlexFields(selectedValue: any, flexfieldCode: string) {
    let apiFieldList = [...this.section2SectionFields];
    this.updateDisplayPropertyOfContextFlexfields(
      selectedValue,
      apiFieldList,
      flexfieldCode,
      this.backendService,
      this.section2SectionData,
      true
    );
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createStudentForFlexfields") {
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
    let apiFieldList = [...this.section2SectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.section2SectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
