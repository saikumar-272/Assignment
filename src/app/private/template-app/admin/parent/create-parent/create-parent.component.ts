import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateParentRequestModel} from "src/app/shared/interfaces/dto/template-app/parent/create-parent";
import {CreateApiResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ToastNotificationService} from "src/app/toast-notification-service";

import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";

@Component({
selector: "app-create-parent",
  templateUrl: "./create-parent.component.html",
  styleUrls: ["./create-parent.component.scss"],
  imports: [AdminChildSectionFormComponent, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateParentComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "New Parent";
  pageErrors: any = [];
  createParentSectionFields: any = [];
  createParentSectionData: any = {};
  createParentSelectOptionsData: any = {};
  pageComponentReference: any;
  createParentLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateParentSection: true,
  };
  yesNoOptions = YES_NO_OPTIONS;
  isCreateParentButtonDisabled = false;
  processingLineItemRowIndex: number = -1;
  isCreateChildButtonDisabled = false;
  createChildLookupDisplayTextMap: any = {};

  createChildSectionFields: any = [];
  createChildSectionData: any = {};
  createChildSelectOptionsData: any = {};

  isUpdateChildButtonDisabled = false;
  updateChildSectionFields: any = [];
  updateChildSectionData: any = {};
  updateChildSelectOptionsData: any = {};
  updateChildSelectedLookupsDataListObj: any = {};
  updateChildLookupDisplayTextMap: any = {};
  childDataList: Array<any> = [];
  retrieveChildListTableColumns: Array<any> = [];

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["createParent"];
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
      "createParent",
      this.toastNotificationService,
      this.backendService
    );
    let retrievedObjectInfo = {};
    let retrieveChildListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveChildList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveChildListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveChildList",
      retrieveChildListResponseParamList,
      this
    );
    let createChildRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createChild",
        this.backendService,
        this.toastNotificationService
      );
    this.createChildSectionFields = this.getSectionFieldsFromApiRequestParams(
      "createChild",
      createChildRequestParamList,
      this
    );

    let updateChildRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateChild",
        this.backendService,
        this.toastNotificationService
      );
    this.updateChildSectionFields = this.getSectionFieldsFromApiRequestParams(
      "updateChild",
      updateChildRequestParamList,
      this
    );

    let createParentRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createParent",
        this.backendService,
        this.toastNotificationService
      );
    this.createParentSectionFields = this.getSectionFieldsFromApiRequestParams(
      "CreateParent",
      createParentRequestParamList,
      this
    );
    this.setDataToFormOnload(
      "createParent",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "createParent",
      this.currentRoute,
      this,
      this.pageSectionNameList
    );
  }

  async createParent() {
    this.isCreateParentButtonDisabled = true;
    this.resetFormErrors("createParent");
    this.pageErrors = [];
    const requestModel: ICreateParentRequestModel = {
      firstName: this.createParentSectionData["firstName"],
      lastName: this.createParentSectionData["lastName"],
      mobileNumber: this.createParentSectionData["mobileNumber"],
      childList: [],
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      requestModel
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateParentButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    requestModel.childList = this.childDataList;
    this.getUpdatedPayload(
      "createParent",
      requestModel,
      this.createParentSectionData,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService,
      this
    );
    const entityCreateResponse: CreateApiResponseModel =
      await this.backendService.createParent(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityCreateResponse.success == 1) {
      this.createParentSectionFields = [];
      if (
        !this.doAfterSave(
          "createParent",
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
      this.router.navigate(["/in/update-parent"], {
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
          "createParent",
          entityCreateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateParentButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "createParent")
      this.createParentLookupDisplayTextMap[fieldKey] = selectedValue;
    else if (this.toInitLower(fieldApiName) === "createChild")
      this.createChildLookupDisplayTextMap[fieldKey] = selectedValue;
    else if (this.toInitLower(fieldApiName) === "updateChild")
      this.updateChildLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "createParent") {
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
    let apiFieldList = [...this.createParentSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.createParentSectionFields];
    this.displayAField(key, apiFieldList);
  }

  //Start consolidated update line items code block
  async toggleCreateChildPopup(modal: any) {
    this.createChildSectionFields = [];
    this.createChildSectionData = {};
    this.createChildLookupDisplayTextMap = {};
    let createChildRequestParamList =
      await this.getApiRequestParameterListCustom(
        "createChild",
        this.backendService,
        this.toastNotificationService
      );
    this.createChildSectionFields = this.getSectionFieldsFromApiRequestParams(
      "createChild",
      createChildRequestParamList,
      this
    );
    this.modalService
      .open(modal, {
        ariaLabelledBy: "create-child-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.createChildSectionFields = [];
        },
        (reason) => {
          this.createChildSectionFields = [];
        }
      );
  }
  async handleCreateChild(modal: any) {
    this.isCreateChildButtonDisabled = true;
    let request: any = {
      childFirstName: this.createChildSectionData["childFirstName"],
      childLastName: this.createChildSectionData["childLastName"],
      parentUUID: "",
      isCurrentItem: true,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isCreateChildButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.childDataList.push(request);
    this.doAfterRowAdded(
      this.childDataList,
      "CreateChild",
      this.backendService,
      this.toastNotificationService,
      this,
      this.createChildSectionData,
      request,
      this.additionalProperties
    );
    modal.close();
    this.isCreateChildButtonDisabled = false;
  }
  async toggleUpdateChildPopup(
    modal: any,
    rowDataObject: any,
    lineItemRowIndex: number
  ) {
    this.updateChildSectionFields = [];
    this.updateChildLookupDisplayTextMap = {};
    this.processingLineItemRowIndex = lineItemRowIndex;
    this.modifyData(
      "updateChild",
      rowDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );
    let updateChildRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updateChild",
        this.backendService,
        this.toastNotificationService
      );
    this.updateChildSectionFields = this.getSectionFieldsFromApiRequestParams(
      "updateChild",
      updateChildRequestParamList,
      this
    );
    this.setUpdateChildSelectedLookupsDataIntoObj(rowDataObject);
    this.setValuesToChildPopup(rowDataObject);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-child-modal-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updateChildSectionFields = [];
        },
        (reason) => {
          this.updateChildSectionFields = [];
        }
      );
  }
  setValuesToChildPopup(retrievedObjectInfo: any) {
    setTimeout(() => {
      this.updateChildSectionData = { ...retrievedObjectInfo };
    }, 100);
  }

  async handleUpdateChild(modal: any) {
    this.isUpdateChildButtonDisabled = true;
    let request: any = {
      childUUID: "",
      childFirstName: this.updateChildSectionData["childFirstName"],
      childLastName: this.updateChildSectionData["childLastName"],
      isCurrentItem: true,
    };
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      request
    );
    if (numberValidationErrorMessage.length > 0) {
      this.isUpdateChildButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    this.childDataList[this.processingLineItemRowIndex] = request;
    this.doAfterRowAdded(
      this.childDataList,
      "UpdateChild",
      this.backendService,
      this.toastNotificationService,
      this,
      this.updateChildSectionData,
      request,
      this.additionalProperties
    );
    modal.close();
    this.isUpdateChildButtonDisabled = false;
  }
  setUpdateChildSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}
  //End consolidated update line items code block

  updateSelectOptionsData() {}
}
