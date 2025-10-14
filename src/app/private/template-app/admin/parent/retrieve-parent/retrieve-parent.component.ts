import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
//User Actions request model
import {
    retrieveChildListDataObject,
    retrieveChildListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/child/retrieve-child-list";

@Component({
selector: "app-retrieve-parent",
  templateUrl: "./retrieve-parent.component.html",
  styleUrls: ["./retrieve-parent.component.scss"],
  imports: [DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveParentComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Parent";
  userActions: Array<any> = [];
  retrieveParentFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  retrieveChildListResultObjectsList: Array<retrieveChildListDataObject> = [];
  retrieveChildListTableColumns: Array<any> = [];
  selectedParentUUID: string = "";
  selectedChildUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveParentSection: true,
  };
  lineItemsSectionsShowHideInfo = {
    enableRetrieveChildListSection: true,
  };

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveParent"];
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
      this.selectedParentUUID = params["id"];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    if (!(this.selectedParentUUID && this.selectedParentUUID.length > 0)) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveParent(
      this.selectedParentUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveParent",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveParent");
    let retrieveChildListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveChildList",
        this.backendService,
        this.toastNotificationService,
        this
      );
    this.retrieveChildListTableColumns = this.getListApiTableColumnListCustom(
      "retrieveChildList",
      retrieveChildListResponseParamList,
      this
    );
    this.fetchRetrieveChildList();

    //Load page fields
    let retrieveParentResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveParent",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveParentFieldList = this.getRetrievePageSectionFieldListCustom(
      "retrieveParent",
      "RetrieveParent",
      retrieveParentResponseParamList,
      this.additionalProperties
    );
    this.doAfterPageDataLoaded(
      "retrieveParent",
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
      "retrieveParent",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields
  }

  async fetchRetrieveChildList() {
    var searchFilter: retrieveChildListSearchFilter = <
      retrieveChildListSearchFilter
    >{};
    searchFilter.parentUUID = this.selectedParentUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveChildList(searchFilter)
    );
    this.retrieveChildListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData(
      "retrieveChildList",
      this.retrieveChildListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(actionName, "RetrieveParent", this.router, {
      id: this.selectedParentUUID,
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
