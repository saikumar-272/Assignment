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
import {
    IRetrieveSalesInvoiceDto
} from "src/app/shared/interfaces/dto/template-app/sales-invoice/retrieve-sales-invoice";
import {TimeZoneService} from "src/app/shared/services/timeZone.service";
//User Actions request model
import {
    retrieveInvoiceLineItemListDataObject,
    retrieveInvoiceLineItemListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/invoice-line-item/retrieve-invoice-line-item-list";
import {
    retrieveCostCenterLineItemListDataObject,
    retrieveCostCenterLineItemListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/cost-center-line-item/retrieve-cost-center-line-item-list";

import {getNumberWithCommaSeparated} from "src/app/shared/util/string-util";
@Component({
selector: "app-retrieve-sales-invoice",
  templateUrl: "./retrieve-sales-invoice.component.html",
  styleUrls: ["./retrieve-sales-invoice.component.scss"],
  imports: [DynamicFieldDisplayComponent, CommonModule, RouterModule, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveSalesInvoiceComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = "Sales Invoice";
  userActions: Array<any> = [];
  retrieveSalesInvoiceFieldList: Array<any> = [];
  retrievedDataObject: any = {};

  //Action forms with request params

  retrieveInvoiceLineItemListResultObjectsList: Array<retrieveInvoiceLineItemListDataObject> =
    [];
  retrieveInvoiceLineItemListTableColumns: Array<any> = [];
  retrieveCostCenterLineItemListResultObjectsList: Array<retrieveCostCenterLineItemListDataObject> =
    [];
  retrieveCostCenterLineItemListTableColumns: Array<any> = [];
  selectedSalesInvoiceUUID: string = "";
  selectedInvoiceLineItemUUID: string = "";
  selectedCostCenterLineItemUUID: string = "";
  netAmount: any = 0;
  sectionsShowHideInfo = {
    enableRetrieveSalesInvoiceSection: true,
  };
  lineItemsSectionsShowHideInfo = {
    enableRetrieveInvoiceLineItemListSection: true,
    enableRetrieveCostCenterLineItemListSection: true,
  };

  additionalProperties: any = {};
  pageSectionNameList: any[] = ["retrieveSalesInvoice"];
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
      this.selectedSalesInvoiceUUID = params["id"];
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
        this.selectedSalesInvoiceUUID &&
        this.selectedSalesInvoiceUUID.length > 0
      )
    ) {
      return;
    }
    this.retrievedDataObject = await this.backendService.retrieveSalesInvoice(
      this.selectedSalesInvoiceUUID
    );
    if (
      this.retrievedDataObject.hasOwnProperty("success") &&
      this.retrievedDataObject["success"] == 0
    ) {
      if (this.retrievedDataObject.hasOwnProperty("alert"))
        this.toastNotificationService.showError(this.retrievedDataObject.alert);
    }
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad(
      "retrieveSalesInvoice",
      this.toastNotificationService,
      this.backendService,
      this.retrievedDataObject
    );
    this.userActions = this.getUserActionsCustom("RetrieveSalesInvoice");
    let retrieveInvoiceLineItemListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveInvoiceLineItemList",
        this.backendService,
        this.toastNotificationService,
        this
      );
    this.retrieveInvoiceLineItemListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveInvoiceLineItemList",
        retrieveInvoiceLineItemListResponseParamList,
        this
      );
    let retrieveCostCenterLineItemListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveCostCenterLineItemList",
        this.backendService,
        this.toastNotificationService,
        this
      );
    this.retrieveCostCenterLineItemListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveCostCenterLineItemList",
        retrieveCostCenterLineItemListResponseParamList,
        this
      );
    this.fetchRetrieveInvoiceLineItemList();
    this.fetchRetrieveCostCenterLineItemList();

    //Load page fields
    let retrieveSalesInvoiceResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveSalesInvoice",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveSalesInvoiceFieldList =
      this.getRetrievePageSectionFieldListCustom(
        "retrieveSalesInvoice",
        "RetrieveSalesInvoice",
        retrieveSalesInvoiceResponseParamList,
        this.additionalProperties
      );
    this.doAfterPageDataLoaded(
      "retrieveSalesInvoice",
      this.currentRoute,
      this,
      this.retrievedDataObject
    );
    this.retrievedDataObject =
      this.updateRetrieveApiDataObjectWithInjectedFieldsData(
        this.retrievedDataObject,
        this.toastNotificationService
      );
    this.setPageTotalAttributesData(this.retrievedDataObject);
    this.modifyData(
      "retrieveSalesInvoice",
      this.retrievedDataObject,
      this.additionalProperties,
      this.toastNotificationService,
      this.backendService
    );

    //Initialising custom api form fields

    setTimeout(() => {
      this.updateDisplayPropertyOfApiParameterDependentFields(
        "retrieveSalesInvoice",
        this.retrievedDataObject,
        this.pageSectionNameList,
        this
      );
    }, 100);
  }
  setPageTotalAttributesData(retrievedObjectInfo: IRetrieveSalesInvoiceDto) {
    this.netAmount = getNumberWithCommaSeparated(retrievedObjectInfo.netAmount);
  }

  async fetchRetrieveInvoiceLineItemList() {
    var searchFilter: retrieveInvoiceLineItemListSearchFilter = <
      retrieveInvoiceLineItemListSearchFilter
    >{};
    searchFilter.salesInvoiceUUID = this.selectedSalesInvoiceUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveInvoiceLineItemList(searchFilter)
    );
    this.retrieveInvoiceLineItemListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData(
      "retrieveInvoiceLineItemList",
      this.retrieveInvoiceLineItemListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }
  async fetchRetrieveCostCenterLineItemList() {
    var searchFilter: retrieveCostCenterLineItemListSearchFilter = <
      retrieveCostCenterLineItemListSearchFilter
    >{};
    searchFilter.salesInvoiceUUID = this.selectedSalesInvoiceUUID;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveCostCenterLineItemList(searchFilter)
    );
    this.retrieveCostCenterLineItemListResultObjectsList = searchResponse.list;
    this.retrieveCostCenterLineItemListResultObjectsList =
      this.updateListApiDataWithInjectedFieldsData(
        this.retrieveCostCenterLineItemListResultObjectsList,
        this.toastNotificationService
      );
    this.modifyLineItemsListData(
      "retrieveCostCenterLineItemList",
      this.retrieveCostCenterLineItemListResultObjectsList,
      this.toastNotificationService,
      this.backendService
    );
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveSalesInvoice",
      this.router,
      { id: this.selectedSalesInvoiceUUID }
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
