import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {RetrieveListResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {TimeZoneService} from 'src/app/shared/services/timeZone.service';
//User Actions request model
import {
    retrieveAssetComponentListDataObject,
    retrieveAssetComponentListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/asset-component/retrieve-asset-component-list';
import {
    retrieveComponentSpareListDataObject,
    retrieveComponentSpareListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/component-spare/retrieve-component-spare-list';

@Component({
selector: 'app-retrieve-asset',
  templateUrl: './retrieve-asset.component.html',
  styleUrls: ['./retrieve-asset.component.scss']
, imports: [CommonModule, RouterModule, DynamicFieldDisplayComponent, NgbModule],
  standalone: true
})
export class RetrieveAssetComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Asset'
  userActions : Array<any> = [];
  retrieveAssetFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params

  retrieveAssetComponentListResultObjectsList: Array<retrieveAssetComponentListDataObject> = [];
  retrieveAssetComponentListTableColumns : Array<any> = [];
  retrieveComponentSpareListResultObjectsList: Array<retrieveComponentSpareListDataObject> = [];
  retrieveComponentSpareListTableColumns : Array<any> = [];
  selectedAssetUUID: string = "";
  selectedAssetComponentUUID: string = "";
  selectedComponentSpareUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveAssetSection : true
  }
  lineItemsSectionsShowHideInfo = {
      enableRetrieveAssetComponentListSection : true,
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveAsset"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedAssetUUID = params['id'];
    });
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void>
  {
      this.pageComponentReference = this;
      if (!(this.selectedAssetUUID && this.selectedAssetUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveAsset(this.selectedAssetUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveAsset", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveAsset');
      let retrieveAssetComponentListResponseParamList = await this.getApiResponseParameterListCustom('retrieveAssetComponentList', this.backendService, this.toastNotificationService, this);
      this.retrieveAssetComponentListTableColumns = this.getListApiTableColumnListCustom('retrieveAssetComponentList', retrieveAssetComponentListResponseParamList, this);
      let retrieveComponentSpareListResponseParamList = await this.getApiResponseParameterListCustom('retrieveComponentSpareList', this.backendService, this.toastNotificationService, this);
      this.retrieveComponentSpareListTableColumns = this.getListApiTableColumnListCustom('retrieveComponentSpareList', retrieveComponentSpareListResponseParamList, this);
      this.fetchRetrieveAssetComponentList();

      //Load page fields
      let retrieveAssetResponseParamList = await this.getApiResponseParameterListCustom('retrieveAsset', this.backendService, this.toastNotificationService);
      this.retrieveAssetFieldList = this.getRetrievePageSectionFieldListCustom('retrieveAsset', "RetrieveAsset", retrieveAssetResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveAsset", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveAsset", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields


  }

  async fetchRetrieveAssetComponentList()
  {
    var searchFilter: retrieveAssetComponentListSearchFilter = <retrieveAssetComponentListSearchFilter>{};
    searchFilter.assetUUID = this.selectedAssetUUID
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveAssetComponentList(searchFilter);
    this.retrieveAssetComponentListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveAssetComponentList", this.retrieveAssetComponentListResultObjectsList, this.toastNotificationService, this.backendService);
  }
  async fetchRetrieveComponentSpareList()
  {
    var searchFilter: retrieveComponentSpareListSearchFilter = <retrieveComponentSpareListSearchFilter>{};
    searchFilter.assetComponentUUID = this.selectedAssetComponentUUID
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveComponentSpareList(searchFilter);
    this.retrieveComponentSpareListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveComponentSpareList", this.retrieveComponentSpareListResultObjectsList, this.toastNotificationService, this.backendService);
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveAsset', this.router, {"id" : this.selectedAssetUUID});
  }
  async onLookupValueSelected(selectedValue: any, field : any) {
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
  }
  async showRetrieveComponentSpareListPopup(modal: any, selectedLineItemId : string)
  {
    this.selectedAssetComponentUUID = selectedLineItemId;
    this.fetchRetrieveComponentSpareList();
    this.modalService.open(modal, {modalDialogClass:"modal-dialog"}).result.then(async (result) => {
    }, (reason) => {
    });
  }
  showUserActions(): boolean {
    return (
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData()
  {
  }
}
