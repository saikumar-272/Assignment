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
    retrieveFormFieldApiListDataObject,
    retrieveFormFieldApiListSearchFilter
} from 'src/app/shared/interfaces/dto/template-app/form-field-api/retrieve-form-field-api-list';

@Component({
selector: 'app-retrieve-custom-form-field',
  templateUrl: './retrieve-custom-form-field.component.html',
  styleUrls: ['./retrieve-custom-form-field.component.scss']
, imports: [CommonModule, RouterModule, DynamicFieldDisplayComponent, NgbModule],
  standalone: true
})
export class RetrieveCustomFormFieldComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Custom Form Field'
  userActions : Array<any> = [];
  retrieveCustomFormFieldFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params

  retrieveFormFieldApiListResultObjectsList: Array<retrieveFormFieldApiListDataObject> = [];
  retrieveFormFieldApiListTableColumns : Array<any> = [];
  selectedCustomFormFieldUUID: string = "";
  selectedFormFieldApiUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveCustomFormFieldSection : true
  }
  lineItemsSectionsShowHideInfo = {
      enableRetrieveFormFieldApiListSection : true,
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveCustomFormField"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedCustomFormFieldUUID = params['id'];
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
      if (!(this.selectedCustomFormFieldUUID && this.selectedCustomFormFieldUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveCustomFormField(this.selectedCustomFormFieldUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveCustomFormField", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveCustomFormField');
      let retrieveFormFieldApiListResponseParamList = await this.getApiResponseParameterListCustom('retrieveFormFieldApiList', this.backendService, this.toastNotificationService, this);
      this.retrieveFormFieldApiListTableColumns = this.getListApiTableColumnListCustom('retrieveFormFieldApiList', retrieveFormFieldApiListResponseParamList, this);
      this.fetchRetrieveFormFieldApiList();

      //Load page fields
      let retrieveCustomFormFieldResponseParamList = await this.getApiResponseParameterListCustom('retrieveCustomFormField', this.backendService, this.toastNotificationService);
      this.retrieveCustomFormFieldFieldList = this.getRetrievePageSectionFieldListCustom('retrieveCustomFormField', "RetrieveCustomFormField", retrieveCustomFormFieldResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveCustomFormField", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveCustomFormField", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields


  }

  async fetchRetrieveFormFieldApiList()
  {
    var searchFilter: retrieveFormFieldApiListSearchFilter = <retrieveFormFieldApiListSearchFilter>{};
    searchFilter.customFormFieldUUID = this.selectedCustomFormFieldUUID
    let searchResponse = <RetrieveListResponseModel>await this.backendService.retrieveFormFieldApiList(searchFilter);
    this.retrieveFormFieldApiListResultObjectsList = searchResponse.list;
    this.modifyLineItemsListData("retrieveFormFieldApiList", this.retrieveFormFieldApiListResultObjectsList, this.toastNotificationService, this.backendService);
  }

  //Start User actions

  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveCustomFormField', this.router, {"id" : this.selectedCustomFormFieldUUID});
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
