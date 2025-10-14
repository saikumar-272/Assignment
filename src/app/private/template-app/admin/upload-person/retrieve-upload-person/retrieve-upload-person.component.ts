import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
//User Actions request model
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";


import {ToastNotificationService} from "src/app/toast-notification-service";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";

@Component({
selector: "app-retrieve-upload-person",
  imports: [CommonModule, DynamicFieldDisplayComponent, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./retrieve-upload-person.component.html",
  styleUrls: ["./retrieve-upload-person.component.scss"],
  standalone: true
})
export class RetrieveUploadPersonComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "UploadPerson";
  userActions: Array<any> = [];
  retrieveUploadPersonFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  selectedUploadPersonUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveUploadPersonSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveUploadPerson"];
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
      this.selectedUploadPersonUUID = params["id"];
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
        this.selectedUploadPersonUUID &&
        this.selectedUploadPersonUUID.length > 0
      )
    ) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveUploadPerson(
      this.selectedUploadPersonUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveUploadPerson",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveUploadPerson");

    //Load page fields
    let retrieveUploadPersonResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveUploadPerson",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveUploadPersonFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "retrieveUploadPerson",
        "RetrieveUploadPerson",
        retrieveUploadPersonResponseParamList,
        this.additionalProperties
      );
    this.doAfterPageDataLoaded(
      "retrieveUploadPerson",
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
      "retrieveUploadPerson",
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
    this.executeUserActionCustom(
      actionName,
      "RetrieveUploadPerson",
      this.router,
      { id: this.selectedUploadPersonUUID }
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
