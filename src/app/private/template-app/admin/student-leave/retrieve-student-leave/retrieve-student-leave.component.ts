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
selector: "app-retrieve-student-leave",
  imports: [RouterModule, CommonModule, NgbModule],
  templateUrl: "./retrieve-student-leave.component.html",
  styleUrls: ["./retrieve-student-leave.component.scss"],
  standalone: true
})
export class RetrieveStudentLeaveComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "StudentLeave";
  userActions: Array<any> = [];
  retrieveStudentLeaveFieldList: Array<any> = [];
  retrieveStudentLeaveDataObject: any = {};

  //Action forms with request params

  selectedStudentLeaveUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveStudentLeaveSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveStudentLeave"];
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
      this.selectedStudentLeaveUUID = params["id"];
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
        this.selectedStudentLeaveUUID &&
        this.selectedStudentLeaveUUID.length > 0
      )
    ) {
      return;
    }
    let retrievedObjectInfo = await this.backendService.retrieveStudentLeave(
      this.selectedStudentLeaveUUID
    );
    if (
      retrievedObjectInfo.hasOwnProperty("success") &&
      retrievedObjectInfo["success"] == 0
    ) {
      if (retrievedObjectInfo.hasOwnProperty("alert"))
        this.toastNotificationService.showError(retrievedObjectInfo.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveStudentLeave",
      this.toastNotificationService,
      this.backendService,
      retrievedObjectInfo
    );
    this.userActions = this.getUserActionsCustom("RetrieveStudentLeave");

    //Load page fields
    let retrieveStudentLeaveResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStudentLeave",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentLeaveFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "retrieveStudentLeave",
        "RetrieveStudentLeave",
        retrieveStudentLeaveResponseParamList,
        this.additionalProperties
      );
    this.retrieveStudentLeaveDataObject = retrievedObjectInfo;
    this.doAfterPageDataLoaded(
      "retrieveStudentLeave",
      this.currentRoute,
      this,
      this.retrieveStudentLeaveDataObject
    );
    this.retrieveStudentLeaveDataObject =
      this.updateRetrieveApiDataObjectWithInjectedFieldsData(
        this.retrieveStudentLeaveDataObject,
        this.toastNotificationService
      );
    this.modifyData(
      "retrieveStudentLeave",
      this.retrieveStudentLeaveDataObject,
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
      "RetrieveStudentLeave",
      this.router,
      { id: this.selectedStudentLeaveUUID }
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
