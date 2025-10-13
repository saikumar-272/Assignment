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
selector: "app-retrieve-person",
  templateUrl: "./retrieve-person.component.html",
  styleUrls: ["./retrieve-person.component.scss"],
  imports: [BrowserAnimationsModule, DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule],
  standalone: true
})
export class RetrievePersonComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Person";
  userActions: Array<any> = [];
  retrievePersonFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  selectedPersonUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrievePersonSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrievePerson"];
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
      this.selectedPersonUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    if (!(this.selectedPersonUUID && this.selectedPersonUUID.length > 0)) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrievePerson(
      this.selectedPersonUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrievePerson",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrievePerson");

    //Load page fields
    let retrievePersonResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrievePerson",
        this.backendService,
        this.toastNotificationService
      );
    this.retrievePersonFieldList = this.getRetrievePageSectionFieldListCustom(
      "retrievePerson",
      "RetrievePerson",
      retrievePersonResponseParamList,
      this.additionalProperties
    );
    this.doAfterPageDataLoaded(
      "retrievePerson",
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
      "retrievePerson",
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
    this.executeUserActionCustom(actionName, "RetrievePerson", this.router, {
      id: this.selectedPersonUUID,
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
