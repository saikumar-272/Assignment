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
    IUpdateEmpLocationRequestModel
} from 'src/app/shared/interfaces/dto/template-app/emp-location/update-emp-location';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';
import {RichTextEditorComponent} from 'src/app/private/editor/rich-text-editor.component';

@Component({
selector: 'app-update-emp-location',
  templateUrl: './update-emp-location.component.html',
  styleUrls: ['./update-emp-location.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class UpdateEmpLocationComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Employee Location'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateEmpLocationButtonDisabled = false;
  updateEmpLocationSectionFields: any = [];
  updateEmpLocationSectionData: any = {};
  updateEmpLocationSelectOptionsData: any = {};
  updateEmpLocationSelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateEmpLocationLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedEmpLocationUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateEmpLocationSection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  @ViewChild('angularEditorPopupCompRef') angularEditorPopupCompRef!:RichTextEditorComponent;
  editorAngularEditorInputData! : string;
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateEmpLocation"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedEmpLocationUUID = params['id'];
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
    var pageApiName = 'updateEmpLocation';
    if (this.selectedEmpLocationUUID && this.selectedEmpLocationUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveEmpLocation(this.selectedEmpLocationUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateEmpLocation", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateEmpLocationRequestParamList = await this.getApiRequestParameterListCustom('updateEmpLocation', this.backendService, this.toastNotificationService);
      this.updateEmpLocationSectionFields = this.getSectionFieldsFromApiRequestParams('UpdateEmpLocation', updateEmpLocationRequestParamList, this);
      this.modifyData("updateEmpLocation", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);



    }
  }





  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateEmpLocationSectionData = retrievedObjectInfo;
        this.updateEmpLocationLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateEmpLocation", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateEmpLocation", this, retrievedObjectInfo);
   }, 100)
  }
  async updateEmpLocation()
  {
    this.isUpdateEmpLocationButtonDisabled = true;
    this.resetFormErrors("updateEmpLocation");
    this.pageErrors = []
    const requestModel: IUpdateEmpLocationRequestModel =
    {
      empLocationUUID : this.selectedEmpLocationUUID,
        locationName: this.updateEmpLocationSectionData['locationName'],
        locationType: this.getComboParameterValue(this.updateEmpLocationSectionData['locationType']),
        enableLocationNameUpdate: this.getBooleanParameterValue(this.updateEmpLocationSectionData['enableLocationNameUpdate']),
        description: this.updateEmpLocationSectionData['description'],
        editor1: this.updateEmpLocationSectionData['editor1'],
        editor2: this.updateEmpLocationSectionData['editor2'],
    };
    this.getUpdatedPayload("updateEmpLocation", requestModel, this.updateEmpLocationSectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateEmpLocationButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateEmpLocation(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateEmpLocation", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('updateEmpLocation', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateEmpLocationButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateEmpLocation")
      this.updateEmpLocationLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateEmpLocation')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateEmpLocationSectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateEmpLocationSectionFields];
    this.displayAField(key, apiFieldList);
  }

  openAngularEditorPopup(fieldName: string, sectionName : string) {
    if(1>2){}
    else if(fieldName == "editor1" && sectionName == 'updateEmpLocation'){
      this.angularEditorPopupCompRef.showAngularEditorPopup(sectionName, fieldName, this.updateEmpLocationSectionData[fieldName], true);
    }
    else if(fieldName == "editor2" && sectionName == 'updateEmpLocation'){
      this.angularEditorPopupCompRef.showAngularEditorPopup(sectionName, fieldName, this.updateEmpLocationSectionData[fieldName], true);
    }
  }

  setAngularEditorPopupValue(angularEditorDataObj : any)
  {
    let processingSectionName = angularEditorDataObj['processingSectionName'];
    let processingFieldName = angularEditorDataObj['processingFieldName'];
    if(1>2){}
    else if(processingFieldName == "editor1" && processingSectionName == 'updateEmpLocation')
      this.updateEmpLocationSectionData['editor1'] = angularEditorDataObj['editorInputData'];
    else if(processingFieldName == "editor2" && processingSectionName == 'updateEmpLocation')
      this.updateEmpLocationSectionData['editor2'] = angularEditorDataObj['editorInputData'];
  }
  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }


  updateSelectOptionsData()
  {
    this.updateEmpLocationSelectOptionsData['locationType'] = OptionsList.LocationType;
  }
}
