import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {FormlyFieldConfig} from "@ngx-formly/core";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IResponseMessage} from "src/app/shared/interfaces/dto/dto-base";
import {Constants} from "src/app/shared/util/constants";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
//User Actions request model
import {
    IUpdatePrivilegeGroupItemsRequestModel
} from "src/app/shared/interfaces/dto/template-app/privilege-group/update-privilege-group-items";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-retrieve-privilege-group",
  templateUrl: "./retrieve-privilege-group.component.html",
  styleUrls: ["./retrieve-privilege-group.component.scss"],
  imports: [BrowserAnimationsModule, DynamicFieldDisplayComponent, AdminChildSectionFormComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class RetrievePrivilegeGroupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Privilege Group";
  userActions: Array<any> = [];
  retrievePrivilegeGroupFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params
  isUpdatePrivilegeGroupItemsButtonDisabled = false;
  isUpdatePrivilegeGroupItemsEnabled = true;
  updatePrivilegeGroupItemsForm = new FormGroup({});
  updatePrivilegeGroupItemsModel: any = {};
  updatePrivilegeGroupItemsFields: FormlyFieldConfig[] = [];
  updatePrivilegeGroupItemsLookupDisplayTextMap: any = {};

  updatePrivilegeGroupItemsSectionFields: any = [];
  updatePrivilegeGroupItemsSectionData: any = {};
  updatePrivilegeGroupItemsSelectOptionsData: any = {};
  updatePrivilegeGroupItemsSelectedLookupsDataListObj: any = {};

  selectedPrivilegeGroupUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrievePrivilegeGroupSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrievePrivilegeGroup"];
  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private fb: FormBuilder,
    private currentRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private timeZoneService: TimeZoneService
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.selectedPrivilegeGroupUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    if (
      !(
        this.selectedPrivilegeGroupUUID &&
        this.selectedPrivilegeGroupUUID.length > 0
      )
    ) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrievePrivilegeGroup(
      this.selectedPrivilegeGroupUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrievePrivilegeGroup",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrievePrivilegeGroup");

    //Load page fields
    let retrievePrivilegeGroupResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrievePrivilegeGroup",
        this.backendService,
        this.toastNotificationService
      );
    this.retrievePrivilegeGroupFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "retrievePrivilegeGroup",
        "RetrievePrivilegeGroup",
        retrievePrivilegeGroupResponseParamList,
        this.additionalProperties
      );
    this.doAfterPageDataLoaded(
      "retrievePrivilegeGroup",
      this.currentRoute,
      this,
      this.retrievedDataObject
    );
    this.retrievedDataObject =
      this.updateRetrieveApiDataObjectWithInjectedFieldsData(
        this.retrievedDataObject,
        this.toastNotificationService
      );
    this.modifyData(
      "retrievePrivilegeGroup",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
    let updatePrivilegeGroupItemsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updatePrivilegeGroupItems",
        this.backendService,
        this.toastNotificationService
      );
    this.updatePrivilegeGroupItemsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updatePrivilegeGroupItems",
        updatePrivilegeGroupItemsRequestParamList,
        this
      );
  }

  //Start User actions
  async openUpdatePrivilegeGroupItemsPopup(modal: any) {
    this.updatePrivilegeGroupItemsSectionFields = [];
    this.updatePrivilegeGroupItemsSectionData = {};
    let updatePrivilegeGroupItemsRequestParamList =
      await this.getApiRequestParameterListCustom(
        "updatePrivilegeGroupItems",
        this.backendService,
        this.toastNotificationService
      );
    this.updatePrivilegeGroupItemsSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "updatePrivilegeGroupItems",
        updatePrivilegeGroupItemsRequestParamList,
        this
      );
    this.setUpdatePrivilegeGroupItemsSelectedLookupsDataIntoObj(
      this.retrievedDataObject
    );
    this.updatePrivilegeGroupItemsLookupDisplayTextMap = {};
    setTimeout(() => {
      this.updatePrivilegeGroupItemsSectionData = {
        ...this.retrievedDataObject,
      };
      this.updatePrivilegeGroupItemsForm.patchValue(this.retrievedDataObject);
    }, 100);
    this.modalService
      .open(modal, {
        ariaLabelledBy: "update-privilege-group-items-title",
        modalDialogClass: "modal-dialog",
      })
      .result.then(
        async (result) => {
          this.updatePrivilegeGroupItemsForm.reset();
        },
        (reason) => {
          this.updatePrivilegeGroupItemsForm.reset();
        }
      );
  }

  async updatePrivilegeGroupItems(modal: any) {
    this.isUpdatePrivilegeGroupItemsButtonDisabled = true;
    const updatePrivilegeGroupItemsRequestModel: IUpdatePrivilegeGroupItemsRequestModel =
      {
        privilegeGroupItemList: [],
        privilegeGroupUUID: this.selectedPrivilegeGroupUUID,
      };
    const response: IResponseMessage =
      await this.backendService.updatePrivilegeGroupItems(
        updatePrivilegeGroupItemsRequestModel
      );
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess(
        "UpdatePrivilegeGroupItems",
        this.router,
        response,
        this.backendService,
        this.toastNotificationService
      );
    } else {
      this.toastNotificationService.showError(response.alert);
    }
    this.isUpdatePrivilegeGroupItemsButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrievePrivilegeGroup",
      this.router,
      { id: this.selectedPrivilegeGroupUUID }
    );
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {}
  showUserActions(): boolean {
    return (
      this.doesUserHaveAccess("UpdatePrivilegeGroupItems") ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData() {}
  setUpdatePrivilegeGroupItemsSelectedLookupsDataIntoObj(
    retrievedObjectInfo: any
  ) {}
}
