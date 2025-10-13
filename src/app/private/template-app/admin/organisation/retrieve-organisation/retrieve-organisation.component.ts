import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {ToastNotificationService} from "src/app/toast-notification-service";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
//User Actions request model
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
selector: "app-retrieve-organisation",
  templateUrl: "./retrieve-organisation.component.html",
  styleUrls: ["./retrieve-organisation.component.scss"],
  imports: [BrowserAnimationsModule, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class RetrieveOrganisationComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Organisation";
  userActions: Array<any> = [];
  retrieveOrganisationFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  selectedOrganisationUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveOrganisationSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveOrganisation"];
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
      this.selectedOrganisationUUID = params["id"];
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
        this.selectedOrganisationUUID &&
        this.selectedOrganisationUUID.length > 0
      )
    ) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveOrganisation(
      this.selectedOrganisationUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveOrganisation",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveOrganisation");

    //Load page fields
    let retrieveOrganisationResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveOrganisation",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveOrganisationFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "retrieveOrganisation",
        "RetrieveOrganisation",
        retrieveOrganisationResponseParamList,
        this.additionalProperties
      );
    this.doAfterPageDataLoaded(
      "retrieveOrganisation",
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
      "retrieveOrganisation",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields

    setTimeout(() => {
      this.updateDisplayPropertyOfApiParameterDependentFields(
        "retrieveOrganisation",
        this.retrievedDataObject,
        this.pageSectionNameList,
        this
      );
    }, 100);
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveOrganisation",
      this.router,
      { id: this.selectedOrganisationUUID }
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
    return this.userActions && this.userActions.length > 0;
  }
  updateSelectOptionsData() {}
}
