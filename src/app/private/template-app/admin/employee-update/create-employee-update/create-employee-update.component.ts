import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateEmployeeUpdateRequestModel
} from 'src/app/shared/interfaces/dto/template-app/employee-update/create-employee-update';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-employee-update',
  templateUrl: './create-employee-update.component.html',
  styleUrls: ['./create-employee-update.component.scss']
, imports: [CommonModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateEmployeeUpdateComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Employee Update'
  pageErrors: any = [];
  isCreateEmployeeUpdateButtonDisabled = false;
  createEmployeeUpdateSectionFields: any = [];
  createEmployeeUpdateSectionData: any = {};
  createEmployeeUpdateSelectOptionsData: any = {};
  pageComponentReference: any;
  createEmployeeUpdateLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateEmployeeUpdateSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createEmployeeUpdate"];
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
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createEmployeeUpdate", this.toastNotificationService, this.backendService);

    let createEmployeeUpdateRequestParamList = await this.getApiRequestParameterListCustom('createEmployeeUpdate', this.backendService, this.toastNotificationService);
    this.createEmployeeUpdateSectionFields = this.getSectionFieldsFromApiRequestParams('CreateEmployeeUpdate', createEmployeeUpdateRequestParamList, this);
    this.setDataToFormOnload("createEmployeeUpdate", this.router, this.currentRoute, this);
    this.onPageInit("createEmployeeUpdate", this.currentRoute, this, this.pageSectionNameList);
  }

  async createEmployeeUpdate()
  {
    this.isCreateEmployeeUpdateButtonDisabled = true;
    this.resetFormErrors("createEmployeeUpdate");
    this.pageErrors = []
    const requestModel: ICreateEmployeeUpdateRequestModel =
    {
        employeeUUID: this.createEmployeeUpdateSectionData['employeeUUID'],
        nameToUpdate: this.createEmployeeUpdateSectionData['nameToUpdate'],
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateEmployeeUpdateButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createEmployeeUpdate", requestModel, this.createEmployeeUpdateSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createEmployeeUpdate(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createEmployeeUpdateSectionFields = [];
      if(!this.doAfterSave("createEmployeeUpdate", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('createEmployeeUpdate', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateEmployeeUpdateButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createEmployeeUpdate")
      this.createEmployeeUpdateLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createEmployeeUpdate')
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
    let apiFieldList = [...this.createEmployeeUpdateSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createEmployeeUpdateSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
  }

}
