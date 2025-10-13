import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdatePersonRequestModel} from "src/app/shared/interfaces/dto/template-app/person/update-person";
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";

import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";

@Component({
selector: "app-update-person",
  templateUrl: "./update-person.component.html",
  styleUrls: ["./update-person.component.scss"],
  imports: [ AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class UpdatePersonComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit Person";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdatePersonButtonDisabled = false;
  updatePersonSectionFields: any = [];
  updatePersonSectionData: any = {};
  updatePersonSelectOptionsData: any = {};
  updatePersonSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updatePersonLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedPersonUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdatePersonSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updatePerson"];
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
      this.selectedPersonUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updatePerson";
    if (this.selectedPersonUUID && this.selectedPersonUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrievePerson(
        this.selectedPersonUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updatePerson",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updatePersonRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updatePerson",
          this.backendService,
          this.toastNotificationService
        );
      this.updatePersonSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdatePerson",
          updatePersonRequestParamList,
          this
        );
      this.modifyData(
        "updatePerson",
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
      this.updatePersonSectionData = retrievedObjectInfo;
      this.updatePersonLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updatePerson",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updatePerson", this, retrievedObjectInfo);
    }, 100);
  }
  async updatePerson() {
    this.isUpdatePersonButtonDisabled = true;
    this.resetFormErrors("updatePerson");
    this.pageErrors = [];
    const requestModel: IUpdatePersonRequestModel = {
      personUUID: this.selectedPersonUUID,
      name: this.updatePersonSectionData["name"],
      emailId: this.updatePersonSectionData["emailId"],
      contactNo: this.updatePersonSectionData["contactNo"],
    };
    this.getUpdatedPayload(
      "updatePerson",
      requestModel,
      this.updatePersonSectionData,
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
      this.isUpdatePersonButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updatePerson(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updatePerson",
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
          "updatePerson",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdatePersonButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updatePerson")
      this.updatePersonLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updatePerson") {
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
    let apiFieldList = [...this.updatePersonSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updatePersonSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
