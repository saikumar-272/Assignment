import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder,} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateUploadPersonRequestModel
} from "src/app/shared/interfaces/dto/template-app/upload-person/create-upload-person";
import {CreateApiResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-create-upload-person",
  imports: [RouterModule, AdminChildSectionFormComponent, CommonModule, NgbModule],
  templateUrl: "./create-upload-person.component.html",
  styleUrls: ["./create-upload-person.component.scss"],
  standalone: true
})
export class CreateUploadPersonComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New UploadPerson";
  pageErrors: any = [];
  isCreateUploadPersonButtonDisabled = false;
  createUploadPersonSectionFields: any = [];
  createUploadPersonSectionData: any = {};
  createUploadPersonSelectOptionsData: any = {};
  pageComponentReference: any;
  createUploadPersonLookupDisplayTextMap: any = {};

  createUploadPerson_locationList: any[];
  selected_createUploadPerson_locationUUID: string;
  sectionsShowHideInfo = {
    enableCreateUploadPersonSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createUploadPerson"];
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
    this.createUploadPerson_locationList = [];
    this.selected_createUploadPerson_locationUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "createUploadPerson",
      this.toastNotificationService,
      this.backendService
    );

    let createUploadPersonRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createUploadPerson",
        this.backendService,
        this.toastNotificationService
      );
    this.createUploadPersonSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "CreateUploadPerson",
        createUploadPersonRequestParamList,
        this
      );
    this.setDataToFormOnload(
      "createUploadPerson",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createUploadPerson",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createUploadPerson() {
    this.isCreateUploadPersonButtonDisabled = true;
    this.resetFormErrors("createUploadPerson");
    this.pageErrors = [];
    const requestModel: ICreateUploadPersonRequestModel = {
      firstName: this.createUploadPersonSectionData["firstName"],
      lastName: this.createUploadPersonSectionData["lastName"],
      address: this.createUploadPersonSectionData["address"],
      locationUUID: this.createUploadPersonSectionData["locationUUID"],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateUploadPersonButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.getUpdatedPayload(
      "createUploadPerson",
      requestModel,
      this.createUploadPersonSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createUploadPerson(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createUploadPersonSectionFields = [];
      if (
        !this.doAfterSave(
          "createUploadPerson",
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
      this.router.navigate(["/in/retrieve-upload-person"], {
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
          "createUploadPerson",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateUploadPersonButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createUploadPerson")
      this.createUploadPersonLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createUploadPerson") {
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
    let apiFieldList = [...this.createUploadPersonSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createUploadPersonSectionFields];
    this.displayAField(key, apiFieldList);
  }

  updateSelectOptionsData() {}
}
