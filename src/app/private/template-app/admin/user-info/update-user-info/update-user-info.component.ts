import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit,} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateUserInfoRequestModel} from "src/app/shared/interfaces/dto/template-app/user-info/update-user-info";
import {IResponseMessage,} from "src/app/shared/interfaces/dto/dto-base";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {YES_NO_OPTIONS} from "src/app/shared/util/constants";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

@Component({
selector: "app-update-user-info",
  imports: [RouterModule, AdminChildSectionFormComponent, CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./update-user-info.component.html",
  styleUrls: ["./update-user-info.component.scss"],
  standalone: true
})
export class UpdateUserInfoComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageHeading: any = "Edit User Info";
  pageErrors: any = [];
  retrievedDataObject: any = {};

  isUpdateUserInfoButtonDisabled = false;
  updateUserInfoSectionFields: any = [];
  updateUserInfoSectionData: any = {};
  updateUserInfoSelectOptionsData: any = {};
  updateUserInfoSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateUserInfoLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedUserInfoUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateUserInfoSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["updateUserInfo"];
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
      this.selectedUserInfoUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    var pageApiName = "updateUserInfo";
    if (this.selectedUserInfoUUID && this.selectedUserInfoUUID.length > 0) {
      this.retrievedDataObject = await this.backendService.retrieveUserInfo(
        this.selectedUserInfoUUID
      );
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
        "updateUserInfo",
        this.toastNotificationService,
        this.backendService,
        this.retrievedDataObject
      );
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateUserInfoRequestParamList =
        await this.getApiRequestParameterListCustom(
          "updateUserInfo",
          this.backendService,
          this.toastNotificationService
        );
      this.updateUserInfoSectionFields =
        this.getSectionFieldsFromApiRequestParams(
          "UpdateUserInfo",
          updateUserInfoRequestParamList,
          this
        );
      this.modifyData(
        "updateUserInfo",
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
      this.updateUserInfoSectionData = retrievedObjectInfo;
      this.updateUserInfoLookupDisplayTextMap = {};
      this.doAfterPageDataLoaded(
        "updateUserInfo",
        this.currentRoute,
        this,
        retrievedObjectInfo
      );
      this.doAfterModelLoaded("updateUserInfo", this, retrievedObjectInfo);
    }, 100);
  }
  async updateUserInfo() {
    this.isUpdateUserInfoButtonDisabled = true;
    this.resetFormErrors("updateUserInfo");
    this.pageErrors = [];
    const requestModel: IUpdateUserInfoRequestModel = {
      userInfoUUID: this.selectedUserInfoUUID,
      firstName: this.updateUserInfoSectionData["firstName"],
      lastName: this.updateUserInfoSectionData["lastName"],
    };
    this.getUpdatedPayload(
      "updateUserInfo",
      requestModel,
      this.updateUserInfoSectionData,
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
      this.isUpdateUserInfoButtonDisabled = false;
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return;
    }
    const entityUpdateResponse: IResponseMessage =
      await this.backendService.updateUserInfo(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if (entityUpdateResponse.success == 1) {
      if (
        !this.doAfterSave(
          "updateUserInfo",
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
          "updateUserInfo",
          entityUpdateResponse.errors
        );
      } else {
        this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateUserInfoButtonDisabled = false;
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
    if (this.toInitLower(fieldApiName) === "updateUserInfo")
      this.updateUserInfoLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "updateUserInfo") {
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
    let apiFieldList = [...this.updateUserInfoSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key: string) {
    let apiFieldList = [...this.updateUserInfoSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo: any) {}

  updateSelectOptionsData() {}
}
