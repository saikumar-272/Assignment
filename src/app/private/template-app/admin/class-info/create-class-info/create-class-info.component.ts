import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateClassInfoRequestModel} from 'src/app/shared/interfaces/dto/template-app/class-info/create-class-info';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-class-info',
  templateUrl: './create-class-info.component.html',
  styleUrls: ['./create-class-info.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateClassInfoComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Class'
  pageErrors: any = [];
  isCreateClassInfoButtonDisabled = false;
  createClassInfoSectionFields: any = [];
  createClassInfoSectionData: any = {};
  createClassInfoSelectOptionsData: any = {};
  pageComponentReference: any;
  createClassInfoLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateClassInfoSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createClassInfo"];
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
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createClassInfo", this.toastNotificationService, this.backendService);

    let createClassInfoRequestParamList = await this.getApiRequestParameterListCustom('createClassInfo', this.backendService, this.toastNotificationService);
    this.createClassInfoSectionFields = this.getSectionFieldsFromApiRequestParams('CreateClassInfo', createClassInfoRequestParamList, this);
    this.setDataToFormOnload("createClassInfo", this.router, this.currentRoute, this);
    this.onPageInit("createClassInfo", this.currentRoute, this, this.pageSectionNameList);
  }

  async createClassInfo()
  {
    this.isCreateClassInfoButtonDisabled = true;
    this.resetFormErrors("createClassInfo");
    this.pageErrors = []
    const requestModel: ICreateClassInfoRequestModel =
    {
        name: this.createClassInfoSectionData['name'],
        description: this.createClassInfoSectionData['description'],
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateClassInfoButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createClassInfo", requestModel, this.createClassInfoSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createClassInfo(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createClassInfoSectionFields = [];
      if(!this.doAfterSave("createClassInfo", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('createClassInfo', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateClassInfoButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createClassInfo")
      this.createClassInfoLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createClassInfo')
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
    let apiFieldList = [...this.createClassInfoSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createClassInfoSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
  }

}
