import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {TimeZoneService} from 'src/app/shared/services/timeZone.service';

//User Actions request model


@Component({
selector: 'app-retrieve-counry-for-upload',
  templateUrl: './retrieve-counry-for-upload.component.html',
  styleUrls: ['./retrieve-counry-for-upload.component.scss']
, imports: [CommonModule, RouterModule, DynamicFieldDisplayComponent, NgbModule],
  standalone: true
})
export class RetrieveCounryForUploadComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Country'
  userActions : Array<any> = [];
  retrieveCounryForUploadFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params

  selectedCounryForUploadUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveCounryForUploadSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveCounryForUpload"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedCounryForUploadUUID = params['id'];
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
      if (!(this.selectedCounryForUploadUUID && this.selectedCounryForUploadUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveCounryForUpload(this.selectedCounryForUploadUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveCounryForUpload", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveCounryForUpload');

      //Load page fields
      let retrieveCounryForUploadResponseParamList = await this.getApiResponseParameterListCustom('retrieveCounryForUpload', this.backendService, this.toastNotificationService);
      this.retrieveCounryForUploadFieldList = this.getRetrievePageSectionFieldListCustom('retrieveCounryForUpload', "RetrieveCounryForUpload", retrieveCounryForUploadResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveCounryForUpload", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveCounryForUpload", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields


  }


  //Start User actions

  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveCounryForUpload', this.router, {"id" : this.selectedCounryForUploadUUID});
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
