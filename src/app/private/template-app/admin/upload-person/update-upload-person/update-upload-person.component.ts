import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateUploadPersonRequestModel
} from "src/app/shared/interfaces/dto/template-app/upload-person/update-upload-person";
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
selector: "app-update-upload-person",
  imports: [RouterModule, AdminChildSectionFormComponent, CommonModule, NgbModule],
  templateUrl: "./update-upload-person.component.html",
  styleUrls: ["./update-upload-person.component.scss"],
  standalone: true
})
export class UpdateUploadPersonComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit UploadPerson";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateUploadPersonButtonDisabled = false;
  updateUploadPersonSectionFields: any = [];
  updateUploadPersonSectionData: any = {};
  updateUploadPersonSelectOptionsData: any = {};
  updateUploadPersonSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateUploadPersonLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedUploadPersonUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateUploadPersonSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateUploadPerson"];
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
      this.selectedUploadPersonUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateUploadPerson";
    if (
      this.selectedUploadPersonUUID &&
      this.selectedUploadPersonUUID.length > 0
    ) {
      this.retrievedDataObject = await this.backendService.retrieveUploadPerson(
        this.selectedUploadPersonUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateUploadPerson",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateUploadPersonRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateUploadPerson",
          this.backendService,
          this.toastNotificationService
        );
      this.updateUploadPersonSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateUploadPerson",
          updateUploadPersonRequestParamList,
          this
        );
      this.modifyData(
        "updateUploadPerson",
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
      this.updateUploadPersonSectionData = retrievedObjectInfo;
      this.updateUploadPersonLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateUploadPerson",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateUploadPerson", this, retrievedObjectInfo);
    }, 100);
  }
  async updateUploadPerson() {
    this.isUpdateUploadPersonButtonDisabled = true;
    this.resetFormErrors("updateUploadPerson");
    this.pageErrors = [];
    const requestModel: IUpdateUploadPersonRequestModel = {
      uploadPersonUUID: this.selectedUploadPersonUUID,
      firstName: this.updateUploadPersonSectionData["firstName"],
      lastName: this.updateUploadPersonSectionData["lastName"],
      address: this.updateUploadPersonSectionData["address"],
      locationUUID: this.updateUploadPersonSectionData["locationUUID"],
    };
    this.getUpdatedPayload(
      "updateUploadPerson",
      requestModel,
      this.updateUploadPersonSectionData,
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
      this.isUpdateUploadPersonButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateUploadPerson(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateUploadPerson",
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
          "updateUploadPerson",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateUploadPersonButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateUploadPerson")
      this.updateUploadPersonLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateUploadPerson") {
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
    let apiFieldList = [...this.updateUploadPersonSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateUploadPersonSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {
    if (!isBlank(retrievedObjectInfo["locationUUID"])) {
      this.updateUploadPersonSelectedLookupsDataListObj["locationUUID"] = of([
        {
          id: retrievedObjectInfo["locationUUID"],
          value: retrievedObjectInfo["locationDisplayText"],
        }]);
    }
  }

  updateSelectOptionsData() {}
}
