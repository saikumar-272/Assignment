import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import OptionsList from 'src/app/shared/forms-custom/OptionsList.json';
import {
    ICreateEmpLocationRequestModel
} from 'src/app/shared/interfaces/dto/template-app/emp-location/create-emp-location';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {DropDownOption} from 'src/app/shared/interfaces/dropdown_option';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {RichTextEditorComponent} from 'src/app/private/editor/rich-text-editor.component';

@Component({
selector: 'app-create-emp-location',
  templateUrl: './create-emp-location.component.html',
  styleUrls: ['./create-emp-location.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateEmpLocationComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Employee Location'
  pageErrors: any = [];
  isCreateEmpLocationButtonDisabled = false;
  createEmpLocationSectionFields: any = [];
  createEmpLocationSectionData: any = {};
  createEmpLocationSelectOptionsData: any = {};
  pageComponentReference: any;
  createEmpLocationLookupDisplayTextMap: any = {};

  createEmpLocation_locationTypeOptions : DropDownOption[];     
  sectionsShowHideInfo = {
    enableCreateEmpLocationSection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  @ViewChild('angularEditorPopupCompRef') angularEditorPopupCompRef!:RichTextEditorComponent;
  editorAngularEditorInputData! : string;
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createEmpLocation"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router, private modalService: NgbModal, private currentRoute: ActivatedRoute)
  {
      super();
      this.createEmpLocation_locationTypeOptions =
      [
        { id: 'Rural', value: 'Rural' },
        { id: 'Urban', value: 'Urban' }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string) : boolean
  {
    return this.authService.doesUserHavePrivilege(privilegeName)
  }
  async ngOnInit(): Promise<void> 
  {
    this.pageComponentReference = this;
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createEmpLocation", this.toastNotificationService, this.backendService);

    let createEmpLocationRequestParamList = await this.getApiRequestParameterListCustom('createEmpLocation', this.backendService, this.toastNotificationService);
    this.createEmpLocationSectionFields = this.getSectionFieldsFromApiRequestParams('CreateEmpLocation', createEmpLocationRequestParamList, this);
    this.setDataToFormOnload("createEmpLocation", this.router, this.currentRoute, this);
    this.onPageInit("createEmpLocation", this.currentRoute, this, this.pageSectionNameList);
  }

  async createEmpLocation()
  {
    this.isCreateEmpLocationButtonDisabled = true;
    this.resetFormErrors("createEmpLocation");
    this.pageErrors = []
    const requestModel: ICreateEmpLocationRequestModel =
    {
        locationName: this.createEmpLocationSectionData['locationName'],
        locationType: this.getComboParameterValue(this.createEmpLocationSectionData['locationType']),
        enableLocationNameUpdate: this.getBooleanParameterValue(this.createEmpLocationSectionData['enableLocationNameUpdate']),
        description: this.createEmpLocationSectionData['description'],
        editor1: this.createEmpLocationSectionData['editor1'],
        editor2: this.createEmpLocationSectionData['editor2'],
    };
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateEmpLocationButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createEmpLocation", requestModel, this.createEmpLocationSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createEmpLocation(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createEmpLocationSectionFields = [];
      if(!this.doAfterSave("createEmpLocation", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      this.router.navigate(['/in/retrieve-emp-location'], { queryParams: { id:  entityCreateResponse.uuid} });
    }
    else {
      if(entityCreateResponse.errors && entityCreateResponse.errors.length > 0) {
          if(entityCreateResponse.alert && entityCreateResponse.alert.length > 0) {
              toastErrorMessage = entityCreateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityCreateResponse.errors)
          this.populateFieldLevelErrors('createEmpLocation', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateEmpLocationButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createEmpLocation")
      this.createEmpLocationLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createEmpLocation')
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
    let apiFieldList = [...this.createEmpLocationSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createEmpLocationSectionFields];
    this.displayAField(key, apiFieldList);
  }

  openAngularEditorPopup(fieldName: string, sectionName : string) {
    if(1>2){}
    else if(fieldName == "editor1" && sectionName == 'createEmpLocation'){
      this.angularEditorPopupCompRef.showAngularEditorPopup(sectionName, fieldName, this.createEmpLocationSectionData[fieldName], true);
    }
    else if(fieldName == "editor2" && sectionName == 'createEmpLocation'){
      this.angularEditorPopupCompRef.showAngularEditorPopup(sectionName, fieldName, this.createEmpLocationSectionData[fieldName], true);
    }
  }

  setAngularEditorPopupValue(angularEditorDataObj : any)
  {
    let processingSectionName = angularEditorDataObj['processingSectionName'];
    let processingFieldName = angularEditorDataObj['processingFieldName'];
    if(1>2){}
    else if(processingFieldName == "editor1" && processingSectionName == 'createEmpLocation')
      this.createEmpLocationSectionData['editor1'] = angularEditorDataObj['editorInputData'];
    else if(processingFieldName == "editor2" && processingSectionName == 'createEmpLocation')
      this.createEmpLocationSectionData['editor2'] = angularEditorDataObj['editorInputData'];
  }



  updateSelectOptionsData()
  {
    this.createEmpLocationSelectOptionsData['locationType'] = OptionsList.LocationType;
  }

}
