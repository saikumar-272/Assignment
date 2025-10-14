import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    retrieveFlexfieldSegmentListDataObject,
    retrieveFlexfieldSegmentListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/flexfield-segment/retrieve-flexfield-segment-list';

@Component({
selector: 'app-retrieve-flexfield-context-value',
  templateUrl: './retrieve-flexfield-context-value.component.html',
  styleUrls: ['./retrieve-flexfield-context-value.component.scss']
, imports: [CommonModule, RouterModule, DynamicFieldDisplayComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveFlexfieldContextValueComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Flexfield Context Value'
  userActions : Array<any> = [];
  retrieveFlexfieldContextValueFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params

  retrieveFlexfieldSegmentListResultObjectsList: Array<retrieveFlexfieldSegmentListDataObject> = [];
  retrieveFlexfieldSegmentListTableColumns : Array<any> = [];
  selectedFlexfieldContextValueUUID: string = "";
  selectedFlexfieldSegmentUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveFlexfieldContextValueSection : true
  }
  lineItemsSectionsShowHideInfo = {
      enableRetrieveFlexfieldSegmentListSection : true,
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveFlexfieldContextValue"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedFlexfieldContextValueUUID = params['id'];
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
      if (!(this.selectedFlexfieldContextValueUUID && this.selectedFlexfieldContextValueUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveFlexfieldContextValue(this.selectedFlexfieldContextValueUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveFlexfieldContextValue", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveFlexfieldContextValue');
      let retrieveFlexfieldSegmentListResponseParamList = await this.getApiResponseParameterListCustom('retrieveFlexfieldSegmentList', this.backendService, this.toastNotificationService, this);
      this.retrieveFlexfieldSegmentListTableColumns = this.getListApiTableColumnListCustom('retrieveFlexfieldSegmentList', retrieveFlexfieldSegmentListResponseParamList, this);
      this.fetchRetrieveFlexfieldSegmentList();

      //Load page fields
      let retrieveFlexfieldContextValueResponseParamList = await this.getApiResponseParameterListCustom('retrieveFlexfieldContextValue', this.backendService, this.toastNotificationService);
      this.retrieveFlexfieldContextValueFieldList = this.getRetrievePageSectionFieldListCustom('retrieveFlexfieldContextValue', "RetrieveFlexfieldContextValue", retrieveFlexfieldContextValueResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveFlexfieldContextValue", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveFlexfieldContextValue", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields


  }

  async fetchRetrieveFlexfieldSegmentList()
  {
    var searchFilter: retrieveFlexfieldSegmentListSearchFilter = <retrieveFlexfieldSegmentListSearchFilter>{};
    searchFilter.flexfieldContextValueUUID = this.selectedFlexfieldContextValueUUID
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveFlexfieldSegmentList(searchFilter);
    this.retrieveFlexfieldSegmentListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveFlexfieldSegmentList", this.retrieveFlexfieldSegmentListResultObjectsList, this.toastNotificationService, this.backendService);
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveFlexfieldContextValue', this.router, {"id" : this.selectedFlexfieldContextValueUUID});
  }
  async onLookupValueSelected(selectedValue: any, field : any) {
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
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
