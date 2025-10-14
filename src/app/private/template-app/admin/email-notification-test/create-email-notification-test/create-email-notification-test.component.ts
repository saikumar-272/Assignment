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
    ICreateEmailNotificationTestRequestModel
} from 'src/app/shared/interfaces/dto/template-app/email-notification-test/create-email-notification-test';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-email-notification-test',
  templateUrl: './create-email-notification-test.component.html',
  styleUrls: ['./create-email-notification-test.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateEmailNotificationTestComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Email Notification Test'
  pageErrors: any = [];
  isCreateEmailNotificationTestButtonDisabled = false;
  createEmailNotificationTestSectionFields: any = [];
  createEmailNotificationTestSectionData: any = {};
  createEmailNotificationTestSelectOptionsData: any = {};
  pageComponentReference: any;
  createEmailNotificationTestLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateEmailNotificationTestSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createEmailNotificationTest"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router, private modalService: NgbModal, private currentRoute: ActivatedRoute)
  {
      super();
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void> 
  {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createEmailNotificationTest", this.toastNotificationService, this.backendService);

    let createEmailNotificationTestRequestParamList = await this.getApiRequestParameterListCustom('createEmailNotificationTest', this.backendService, this.toastNotificationService);
    this.createEmailNotificationTestSectionFields = this.getSectionFieldsFromApiRequestParams('CreateEmailNotificationTest', createEmailNotificationTestRequestParamList, this);
    this.setDataToFormOnload("createEmailNotificationTest", this.router, this.currentRoute, this);
    this.onPageInit("createEmailNotificationTest", this.currentRoute, this, this.pageSectionNameList);
  }

  async createEmailNotificationTest()
  {
    this.isCreateEmailNotificationTestButtonDisabled = true;
    this.resetFormErrors("createEmailNotificationTest");
    this.pageErrors = []
    const requestModel: ICreateEmailNotificationTestRequestModel =
    {
        subject: this.createEmailNotificationTestSectionData['subject'],
        emailText: this.createEmailNotificationTestSectionData['emailText'],
        emailId: this.createEmailNotificationTestSectionData['emailId'],
        isEmailAddedToQueue: this.getBooleanParameterValue(this.createEmailNotificationTestSectionData['isEmailAddedToQueue']),
        isEmailSent: this.getBooleanParameterValue(this.createEmailNotificationTestSectionData['isEmailSent']),
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateEmailNotificationTestButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createEmailNotificationTest", requestModel, this.createEmailNotificationTestSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createEmailNotificationTest(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createEmailNotificationTestSectionFields = [];
      if(!this.doAfterSave("createEmailNotificationTest", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      this.router.navigate(['/in/retrieve-email-notification-test'], { queryParams: { id:  entityCreateResponse.uuid} });
    }
    else {
      if(entityCreateResponse.errors && entityCreateResponse.errors.length > 0) {
          if(entityCreateResponse.alert && entityCreateResponse.alert.length > 0) {
              toastErrorMessage = entityCreateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityCreateResponse.errors)
          this.populateFieldLevelErrors('createEmailNotificationTest', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateEmailNotificationTestButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createEmailNotificationTest")
      this.createEmailNotificationTestLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createEmailNotificationTest')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
    this.updateDependentFieldsDisplayProps(apiName, key,  selectedValue, this, this.pageSectionNameList);
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.createEmailNotificationTestSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createEmailNotificationTestSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
  }

}
