import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from 'src/app/shared/forms-custom/OptionsList.json';
import {
    ICreateEmployeeForFlexfieldsRequestModel
} from 'src/app/shared/interfaces/dto/template-app/employee/create-employee-for-flexfields';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {DropDownOption} from 'src/app/shared/interfaces/dropdown_option';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-employee-for-flexfields',
  templateUrl: './create-employee-for-flexfields.component.html',
  styleUrls: ['./create-employee-for-flexfields.component.scss']
, imports: [CommonModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateEmployeeForFlexfieldsComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Create Employee For Flexfields'
  pageErrors: any = [];
  isCreateEmployeeForFlexfieldsButtonDisabled = false;
  jobDetailsSectionFields: any = [];
  jobDetailsSectionData: any = {};
  jobDetailsSelectOptionsData: any = {};
  pageComponentReference: any;
  createEmployeeForFlexfieldsLookupDisplayTextMap: any = {};

  createEmployeeForFlexfields_employmentTypeContextOptions : DropDownOption[];     
  sectionsShowHideInfo = {
    enableJobDetailsSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["jobDetails"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router, private modalService: NgbModal, private currentRoute: ActivatedRoute)
  {
      super();
      this.createEmployeeForFlexfields_employmentTypeContextOptions =
      [
        { id: 'Permanent', value: 'Permanent' },
        { id: 'Contract', value: 'Contract' }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void> 
  {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createEmployeeForFlexfields", this.toastNotificationService, this.backendService);

    let createEmployeeForFlexfieldsRequestParamList = await this.getApiRequestParameterListCustom('createEmployeeForFlexfields', this.backendService, this.toastNotificationService);
    this.jobDetailsSectionFields = this.getSectionFieldsFromApiRequestParams('JobDetails', createEmployeeForFlexfieldsRequestParamList, this);
    this.setDataToFormOnload("createEmployeeForFlexfields", this.router, this.currentRoute, this);
    this.onPageInit("createEmployeeForFlexfields", this.currentRoute, this, this.pageSectionNameList);
  }

  async createEmployeeForFlexfields()
  {
    this.isCreateEmployeeForFlexfieldsButtonDisabled = true;
    this.resetFormErrors("createEmployeeForFlexfields");
    this.pageErrors = []
    const requestModel: ICreateEmployeeForFlexfieldsRequestModel =
    {
        employmentTypeContext: this.getComboParameterValue(this.jobDetailsSectionData['employmentTypeContext']),
        employmentTypeColumn1: this.jobDetailsSectionData['employmentTypeColumn1'],
        employmentTypeColumn2: this.jobDetailsSectionData['employmentTypeColumn2'],
        employmentTypeColumn3: this.jobDetailsSectionData['employmentTypeColumn3'],
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateEmployeeForFlexfieldsButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createEmployeeForFlexfields", requestModel, this.jobDetailsSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createEmployeeForFlexfields(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.jobDetailsSectionFields = [];
      if(!this.doAfterSave("createEmployeeForFlexfields", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      
    }
    else {
      if(entityCreateResponse.errors && entityCreateResponse.errors.length > 0) {
          if(entityCreateResponse.alert && entityCreateResponse.alert.length > 0) {
              toastErrorMessage = entityCreateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityCreateResponse.errors)
          this.populateFieldLevelErrors('createEmployeeForFlexfields', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateEmployeeForFlexfieldsButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createEmployeeForFlexfields")
      this.createEmployeeForFlexfieldsLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createEmployeeForFlexfields')
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
    let apiFieldList = [...this.jobDetailsSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.jobDetailsSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
    this.jobDetailsSelectOptionsData['employmentTypeContext'] = OptionsList.EmploymentTypeContext;
  }

}
