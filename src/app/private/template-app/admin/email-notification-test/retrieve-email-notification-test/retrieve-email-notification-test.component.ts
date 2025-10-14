import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DynamicFieldDisplayComponent} from 'src/app/shared/dynamic-field-display/dynamic-field-display.component';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {FormlyFieldConfig} from '@ngx-formly/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {Constants} from 'src/app/shared/util/constants';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {TimeZoneService} from 'src/app/shared/services/timeZone.service';
//User Actions request model
import {
    ICorrelateEmailNotificationTestRequestModel
} from 'src/app/shared/interfaces/dto/template-app/email-notification-test/correlate-email-notification-test';


@Component({
selector: 'app-retrieve-email-notification-test',
  templateUrl: './retrieve-email-notification-test.component.html',
  styleUrls: ['./retrieve-email-notification-test.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class RetrieveEmailNotificationTestComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageComponentReference: any;
  pageHeading: any = 'Email Notification Test'
  userActions : Array<any> = [];
  retrieveEmailNotificationTestFieldList : Array<any> = [];
  retrievedDataObject : any = {};

  //Action forms with request params
  isCorrelateEmailNotificationTestButtonDisabled = false;
  isCorrelateEmailNotificationTestEnabled = true;
  correlateEmailNotificationTestForm = new FormGroup({});
  correlateEmailNotificationTestModel: any = {};
  correlateEmailNotificationTestFields: FormlyFieldConfig[] = [];
  correlateEmailNotificationTestLookupDisplayTextMap: any = {};

  correlateEmailNotificationTestSectionFields: any = [];
  correlateEmailNotificationTestSectionData: any = {};
  correlateEmailNotificationTestSelectOptionsData: any = {};
  correlateEmailNotificationTestSelectedLookupsDataListObj: any = {};

  selectedEmailNotificationTestUUID: string = "";
  sectionsShowHideInfo = {
    enableRetrieveEmailNotificationTestSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["retrieveEmailNotificationTest"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute, private authService : AuthenticationService,
    private modalService: NgbModal, private router: Router, private timeZoneService: TimeZoneService)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedEmailNotificationTestUUID = params['id'];
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
      if (!(this.selectedEmailNotificationTestUUID && this.selectedEmailNotificationTestUUID.length > 0))
      {
         return;
      }
      this.retrievedDataObject = await this.backendService.retrieveEmailNotificationTest(this.selectedEmailNotificationTestUUID);
      if(this.retrievedDataObject.hasOwnProperty('success') && this.retrievedDataObject['success'] == 0)
      {
        if(this.retrievedDataObject.hasOwnProperty('alert'))
          this.toastNotificationService.showError(this.retrievedDataObject.alert);
      }
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("retrieveEmailNotificationTest", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.userActions = this.getUserActionsCustom('RetrieveEmailNotificationTest');

      //Load page fields
      let retrieveEmailNotificationTestResponseParamList = await this.getApiResponseParameterListCustom('retrieveEmailNotificationTest', this.backendService, this.toastNotificationService);
      this.retrieveEmailNotificationTestFieldList = this.getRetrievePageSectionFieldListCustom('retrieveEmailNotificationTest', "RetrieveEmailNotificationTest", retrieveEmailNotificationTestResponseParamList, this.additionalProperties);
      this.doAfterPageDataLoaded("retrieveEmailNotificationTest", this.currentRoute, this, this.retrievedDataObject);
      this.retrievedDataObject = this.updateRetrieveApiDataObjectWithInjectedFieldsData(this.retrievedDataObject, this.toastNotificationService);
      this.modifyData("retrieveEmailNotificationTest", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);

      //Initialising custom api form fields
      let correlateEmailNotificationTestRequestParamList = await this.getApiRequestParameterListCustom('correlateEmailNotificationTest', this.backendService, this.toastNotificationService);
    this.correlateEmailNotificationTestSectionFields = this.getSectionFieldsFromApiRequestParams('correlateEmailNotificationTest', correlateEmailNotificationTestRequestParamList, this);


  }


  //Start User actions
  async openCorrelateEmailNotificationTestPopup(modal: any)
  {
    this.correlateEmailNotificationTestSectionFields = [];
    this.correlateEmailNotificationTestSectionData = {};
    let correlateEmailNotificationTestRequestParamList = await this.getApiRequestParameterListCustom('correlateEmailNotificationTest', this.backendService, this.toastNotificationService);
    this.correlateEmailNotificationTestSectionFields = this.getSectionFieldsFromApiRequestParams('correlateEmailNotificationTest', correlateEmailNotificationTestRequestParamList, this);
    this.setCorrelateEmailNotificationTestSelectedLookupsDataIntoObj(
                                                              this.retrievedDataObject
                                                               );
    this.correlateEmailNotificationTestLookupDisplayTextMap = {};
    setTimeout(() =>
    {
      this.correlateEmailNotificationTestSectionData = { ... 
                                                      this.retrievedDataObject
                                                       };
      this.correlateEmailNotificationTestForm.patchValue(
      this.retrievedDataObject
      );
    }, 100);
    this.modalService.open(modal, { ariaLabelledBy: 'correlate-email-notification-test-title', modalDialogClass:"modal-dialog" }).result.then(async (result) => {
    this.correlateEmailNotificationTestForm.reset();
    }, (reason) => {
    this.correlateEmailNotificationTestForm.reset();
    });
  }

  async correlateEmailNotificationTest(modal: any)
  {
    this.isCorrelateEmailNotificationTestButtonDisabled = true;
    const correlateEmailNotificationTestRequestModel: ICorrelateEmailNotificationTestRequestModel =
    {
      transactionType: this.correlateEmailNotificationTestSectionData['transactionType'],
      transactionUUID: this.correlateEmailNotificationTestSectionData['transactionUUID'],
      notificationType: this.correlateEmailNotificationTestSectionData['notificationType'],
      userType: this.correlateEmailNotificationTestSectionData['userType'],
      correlationPayload: this.correlateEmailNotificationTestSectionData['correlationPayload'],
    };
    const response: IResponseMessage = await this.backendService.correlateEmailNotificationTest(correlateEmailNotificationTestRequestModel);
    if (response.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
      modal.close();
      this.toastNotificationService.showSuccess(response.alert);
      this.doCustomActionOnApiSuccess('CorrelateEmailNotificationTest', this.router, response, this.backendService, this.toastNotificationService);
    }
    else{
      this.toastNotificationService.showError(response.alert);
    }
    this.isCorrelateEmailNotificationTestButtonDisabled = false;
  }
  //End User Actions
  executeUserAction(actionName : any)
  {
    this.executeUserActionCustom(actionName, 'RetrieveEmailNotificationTest', this.router, {"id" : this.selectedEmailNotificationTestUUID});
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
      this.doesUserHaveAccess('CorrelateEmailNotificationTest') ||
      (this.userActions && this.userActions.length > 0)
    );
  }
  updateSelectOptionsData()
  {
  }
  setCorrelateEmailNotificationTestSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {
  }
}
