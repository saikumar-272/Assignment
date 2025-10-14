import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    IUpdateEmailNotificationTestRequestModel
} from 'src/app/shared/interfaces/dto/template-app/email-notification-test/update-email-notification-test';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-email-notification-test',
  templateUrl: './update-email-notification-test.component.html',
  styleUrls: ['./update-email-notification-test.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class UpdateEmailNotificationTestComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Email Notification Test'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateEmailNotificationTestButtonDisabled = false;
  updateEmailNotificationTestSectionFields: any = [];
  updateEmailNotificationTestSectionData: any = {};
  updateEmailNotificationTestSelectOptionsData: any = {};
  updateEmailNotificationTestSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateEmailNotificationTestLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedEmailNotificationTestUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateEmailNotificationTestSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateEmailNotificationTest"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
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
    var pageApiName = 'updateEmailNotificationTest';
    if (this.selectedEmailNotificationTestUUID && this.selectedEmailNotificationTestUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveEmailNotificationTest(this.selectedEmailNotificationTestUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateEmailNotificationTest", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateEmailNotificationTestRequestParamList = await this.getApiRequestParameterListCustom('updateEmailNotificationTest', this.backendService, this.toastNotificationService);
      this.updateEmailNotificationTestSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateEmailNotificationTest', updateEmailNotificationTestRequestParamList, this);
      this.modifyData("updateEmailNotificationTest", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);



    }
  }





  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateEmailNotificationTestSectionData = retrievedObjectInfo;
        this.updateEmailNotificationTestLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateEmailNotificationTest", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateEmailNotificationTest", this, retrievedObjectInfo);
   }, 100)
  }
  async updateEmailNotificationTest()
  {
    this.isUpdateEmailNotificationTestButtonDisabled = true;
    this.resetFormErrors("updateEmailNotificationTest");
    this.pageErrors = []
    const requestModel: IUpdateEmailNotificationTestRequestModel =
    {
      emailNotificationTestUUID : this.selectedEmailNotificationTestUUID,
        subject: this.updateEmailNotificationTestSectionData['subject'],
        emailText: this.updateEmailNotificationTestSectionData['emailText'],
        emailId: this.updateEmailNotificationTestSectionData['emailId'],
        isEmailAddedToQueue: this.getBooleanParameterValue(this.updateEmailNotificationTestSectionData['isEmailAddedToQueue']),
        isEmailSent: this.getBooleanParameterValue(this.updateEmailNotificationTestSectionData['isEmailSent']),
    };
    this.getUpdatedPayload("updateEmailNotificationTest", requestModel, this.updateEmailNotificationTestSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateEmailNotificationTestButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateEmailNotificationTest(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateEmailNotificationTest", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      window.location.reload();
    }
    else {
      if(entityUpdateResponse.errors && entityUpdateResponse.errors.length > 0) {
          if(entityUpdateResponse.alert && entityUpdateResponse.alert.length > 0) {
              toastErrorMessage = entityUpdateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityUpdateResponse.errors)
          this.populateFieldLevelErrors('updateEmailNotificationTest', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateEmailNotificationTestButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateEmailNotificationTest")
      this.updateEmailNotificationTestLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateEmailNotificationTest')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateEmailNotificationTestSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateEmailNotificationTestSectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }


  updateSelectOptionsData()
  {
  }
}
