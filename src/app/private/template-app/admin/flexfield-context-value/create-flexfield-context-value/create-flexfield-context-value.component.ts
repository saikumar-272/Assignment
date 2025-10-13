import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    ICreateFlexfieldContextValueRequestModel
} from 'src/app/shared/interfaces/dto/template-app/flexfield-context-value/create-flexfield-context-value';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-flexfield-context-value',
  templateUrl: './create-flexfield-context-value.component.html',
  styleUrls: ['./create-flexfield-context-value.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule],
  standalone: true
})
export class CreateFlexfieldContextValueComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Flexfield Context Value'
  pageErrors: any = [];
  isCreateFlexfieldContextValueButtonDisabled = false;
  createFlexfieldContextValueSectionFields: any = [];
  createFlexfieldContextValueSectionData: any = {};
  createFlexfieldContextValueSelectOptionsData: any = {};
  pageComponentReference: any;
  createFlexfieldContextValueLookupDisplayTextMap: any = {};

  createFlexfieldContextValue_flexfieldList: any[];
  selected_createFlexfieldContextValue_flexfieldUUID: string;
  sectionsShowHideInfo = {
    enableCreateFlexfieldContextValueSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createFlexfieldContextValue"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router, private modalService: NgbModal, private currentRoute: ActivatedRoute)
  {
      super();
      this.createFlexfieldContextValue_flexfieldList = [];
      this.selected_createFlexfieldContextValue_flexfieldUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void> 
  {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createFlexfieldContextValue", this.toastNotificationService, this.backendService);

    let createFlexfieldContextValueRequestParamList = await this.getApiRequestParameterListCustom('createFlexfieldContextValue', this.backendService, this.toastNotificationService);
    this.createFlexfieldContextValueSectionFields = this.getSectionFieldsFromApiRequestParams('CreateFlexfieldContextValue', createFlexfieldContextValueRequestParamList, this);
    this.setDataToFormOnload("createFlexfieldContextValue", this.router, this.currentRoute, this);
    this.onPageInit("createFlexfieldContextValue", this.currentRoute, this, this.pageSectionNameList);
  }

  async createFlexfieldContextValue()
  {
    this.isCreateFlexfieldContextValueButtonDisabled = true;
    this.resetFormErrors("createFlexfieldContextValue");
    this.pageErrors = []
    const requestModel: ICreateFlexfieldContextValueRequestModel =
    {
        code: this.createFlexfieldContextValueSectionData['code'],
        flexfieldUUID: this.createFlexfieldContextValueSectionData['flexfieldUUID'],
        displayValue: this.createFlexfieldContextValueSectionData['displayValue'],
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateFlexfieldContextValueButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createFlexfieldContextValue", requestModel, this.createFlexfieldContextValueSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createFlexfieldContextValue(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createFlexfieldContextValueSectionFields = [];
      if(!this.doAfterSave("createFlexfieldContextValue", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      this.router.navigate(['/in/update-flexfield-context-value'], { queryParams: { id:  entityCreateResponse.uuid} });
    }
    else {
      if(entityCreateResponse.errors && entityCreateResponse.errors.length > 0) {
          if(entityCreateResponse.alert && entityCreateResponse.alert.length > 0) {
              toastErrorMessage = entityCreateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityCreateResponse.errors)
          this.populateFieldLevelErrors('createFlexfieldContextValue', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateFlexfieldContextValueButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createFlexfieldContextValue")
      this.createFlexfieldContextValueLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createFlexfieldContextValue')
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
    let apiFieldList = [...this.createFlexfieldContextValueSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createFlexfieldContextValueSectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
  }

}
