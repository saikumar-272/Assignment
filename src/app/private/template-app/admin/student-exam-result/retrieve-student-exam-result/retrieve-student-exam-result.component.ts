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
selector: "app-retrieve-student-exam-result",
  imports: [RouterModule, CommonModule, DynamicFieldDisplayComponent, NgbModule],
  templateUrl: "./retrieve-student-exam-result.component.html",
  styleUrls: ["./retrieve-student-exam-result.component.scss"],
  standalone: true
})
export class RetrieveStudentExamResultComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Student Exam Result";
  userActions: Array<any> = [];
  retrieveStudentExamResultFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  selectedStudentExamResultUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveStudentExamResultSection: true,
  };
  lineItemsSectionsShowHideInfo = {};

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveStudentExamResult"];
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
      this.selectedStudentExamResultUUID = params["id"];
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
        this.selectedStudentExamResultUUID &&
        this.selectedStudentExamResultUUID.length > 0
      )
    ) {
      return;
    }
    this.retrievedDataObject =
      await this.backendService.retrieveStudentExamResult(
        this.selectedStudentExamResultUUID
      );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveStudentExamResult",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveStudentExamResult");

    //Load page fields
    let retrieveStudentExamResultResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveStudentExamResult",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveStudentExamResultFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "retrieveStudentExamResult",
        "RetrieveStudentExamResult",
        retrieveStudentExamResultResponseParamList,
        this.additionalProperties
      );
    this.doAfterPageDataLoaded(
      "retrieveStudentExamResult",
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
      "retrieveStudentExamResult",
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
      "RetrieveStudentExamResult",
      this.router,
      { id: this.selectedStudentExamResultUUID }
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
