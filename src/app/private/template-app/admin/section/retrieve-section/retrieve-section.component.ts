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
@Component({
selector: "app-retrieve-section",
  templateUrl: "./retrieve-section.component.html",
  styleUrls: ["./retrieve-section.component.scss"],
  imports: [ DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class RetrieveSectionComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Section";
  userActions: Array<any> = [];
  retrieveSectionFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  selectedSectionUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveSectionSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveSection"];
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
      this.selectedSectionUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    if (!(this.selectedSectionUUID && this.selectedSectionUUID.length > 0)) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveSection(
      this.selectedSectionUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveSection",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveSection");

    //Load page fields
    let retrieveSectionResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveSection",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSectionFieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveSection",
      "RetrieveSection",
      retrieveSectionResponseParamList,
      this.additionalProperties
    );
    this.doAfterPageDataLoaded(
      "retrieveSection",
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
      "retrieveSection",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(actionName, "RetrieveSection", this.router, {
      id: this.selectedSectionUUID,
    });
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
