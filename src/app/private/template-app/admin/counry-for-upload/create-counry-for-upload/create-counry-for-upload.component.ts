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
    ICreateCounryForUploadRequestModel
} from 'src/app/shared/interfaces/dto/template-app/counry-for-upload/create-counry-for-upload';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-counry-for-upload',
  templateUrl: './create-counry-for-upload.component.html',
  styleUrls: ['./create-counry-for-upload.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateCounryForUploadComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Country'
  pageErrors: any = [];
  isCreateCounryForUploadButtonDisabled = false;
  createCounryForUploadSectionFields: any = [];
  createCounryForUploadSectionData: any = {};
  createCounryForUploadSelectOptionsData: any = {};
  pageComponentReference: any;
  createCounryForUploadLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateCounryForUploadSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createCounryForUpload"];
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
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createCounryForUpload", this.toastNotificationService, this.backendService);

    let createCounryForUploadRequestParamList = await this.getApiRequestParameterListCustom('createCounryForUpload', this.backendService, this.toastNotificationService);
    this.createCounryForUploadSectionFields = this.getSectionFieldsFromApiRequestParams('CreateCounryForUpload', createCounryForUploadRequestParamList, this);
    this.setDataToFormOnload("createCounryForUpload", this.router, this.currentRoute, this);
    this.onPageInit("createCounryForUpload", this.currentRoute, this, this.pageSectionNameList);
  }

  async createCounryForUpload()
  {
    this.isCreateCounryForUploadButtonDisabled = true;
    this.resetFormErrors("createCounryForUpload");
    this.pageErrors = []
    const requestModel: ICreateCounryForUploadRequestModel =
    {
        name: this.createCounryForUploadSectionData['name'],
        code: this.createCounryForUploadSectionData['code'],
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateCounryForUploadButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createCounryForUpload", requestModel, this.createCounryForUploadSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createCounryForUpload(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createCounryForUploadSectionFields = [];
      if(!this.doAfterSave("createCounryForUpload", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      this.router.navigate(['/in/retrieve-counry-for-upload'], { queryParams: { id:  entityCreateResponse.uuid} });
    }
    else {
      if(entityCreateResponse.errors && entityCreateResponse.errors.length > 0) {
          if(entityCreateResponse.alert && entityCreateResponse.alert.length > 0) {
              toastErrorMessage = entityCreateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityCreateResponse.errors)
          this.populateFieldLevelErrors('createCounryForUpload', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateCounryForUploadButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createCounryForUpload")
      this.createCounryForUploadLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createCounryForUpload')
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
    let apiFieldList = [...this.createCounryForUploadSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createCounryForUploadSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
  }

}
