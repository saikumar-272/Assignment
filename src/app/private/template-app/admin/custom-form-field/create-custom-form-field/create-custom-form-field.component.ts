import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from 'src/app/shared/forms-custom/OptionsList.json';
import {
    ICreateCustomFormFieldRequestModel
} from 'src/app/shared/interfaces/dto/template-app/custom-form-field/create-custom-form-field';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {DropDownOption} from 'src/app/shared/interfaces/dropdown_option';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-custom-form-field',
  templateUrl: './create-custom-form-field.component.html',
  styleUrls: ['./create-custom-form-field.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateCustomFormFieldComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Create Custom Form Field'
  pageErrors: any = [];
  isCreateCustomFormFieldButtonDisabled = false;
  createCustomFormFieldSectionFields: any = [];
  createCustomFormFieldSectionData: any = {};
  createCustomFormFieldSelectOptionsData: any = {};
  pageComponentReference: any;
  createCustomFormFieldLookupDisplayTextMap: any = {};

  createCustomFormField_dataTypeOptions : DropDownOption[];     
  sectionsShowHideInfo = {
    enableCreateCustomFormFieldSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createCustomFormField"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router, private modalService: NgbModal, private currentRoute: ActivatedRoute)
  {
      super();
      this.createCustomFormField_dataTypeOptions =
      [
        { id: 'String', value: 'String' },
        { id: 'Integer', value: 'Integer' }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void> 
  {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createCustomFormField", this.toastNotificationService, this.backendService);

    let createCustomFormFieldRequestParamList = await this.getApiRequestParameterListCustom('createCustomFormField', this.backendService, this.toastNotificationService);
    this.createCustomFormFieldSectionFields = this.getSectionFieldsFromApiRequestParams('CreateCustomFormField', createCustomFormFieldRequestParamList, this);
    this.setDataToFormOnload("createCustomFormField", this.router, this.currentRoute, this);
    this.onPageInit("createCustomFormField", this.currentRoute, this, this.pageSectionNameList);
  }

  async createCustomFormField()
  {
    this.isCreateCustomFormFieldButtonDisabled = true;
    this.resetFormErrors("createCustomFormField");
    this.pageErrors = []
    const requestModel: ICreateCustomFormFieldRequestModel =
    {
        name: this.createCustomFormFieldSectionData['name'],
        label: this.createCustomFormFieldSectionData['label'],
        dataType: this.getComboParameterValue(this.createCustomFormFieldSectionData['dataType']),
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateCustomFormFieldButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createCustomFormField", requestModel, this.createCustomFormFieldSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createCustomFormField(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createCustomFormFieldSectionFields = [];
      if(!this.doAfterSave("createCustomFormField", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('createCustomFormField', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateCustomFormFieldButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createCustomFormField")
      this.createCustomFormFieldLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createCustomFormField')
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
    let apiFieldList = [...this.createCustomFormFieldSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createCustomFormFieldSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
    this.createCustomFormFieldSelectOptionsData['dataType'] = OptionsList.CustomFormFieldDataType;
  }

}
