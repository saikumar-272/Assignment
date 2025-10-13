import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IUpdateFacultyRequestModel} from 'src/app/shared/interfaces/dto/template-app/faculty/update-faculty';
import {IResponseMessage} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {validateAttachmentSize} from 'src/app/shared/util/form-validators';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-update-faculty',
  templateUrl: './update-faculty.component.html',
  styleUrls: ['./update-faculty.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule],
  standalone: true
})
export class UpdateFacultyComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'Edit Faculty'
  pageErrors: any = [];
  retrievedDataObject : any = {};

  isUpdateFacultyButtonDisabled = false;
  updateFacultySectionFields: any = [];
  updateFacultySectionData: any = {};
  updateFacultySelectOptionsData: any = {};
  updateFacultySelectedLookupsDataListObj: any = {};
  pageComponentReference: any;
  updateFacultyLookupDisplayTextMap: any = {};

  yesNoOptions = YES_NO_OPTIONS;
  selectedFacultyUUID: string = "";
  sectionsShowHideInfo = {
    enableUpdateFacultySection : true
  }
  lineItemsSectionsShowHideInfo = {
  }
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["updateFaculty"];
  constructor(private toastNotificationService : ToastNotificationService, private backendService: BackendServiceTemplateApp, private fb: FormBuilder, private currentRoute: ActivatedRoute,
  private modalService: NgbModal, private customisationService : CustomisationService, private authService : AuthenticationService, private router: Router)
  {
    super();
    this.currentRoute.queryParams.subscribe(params => {
      this.selectedFacultyUUID = params['id'];
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
    var pageApiName = 'updateFaculty';
    if (this.selectedFacultyUUID && this.selectedFacultyUUID.length > 0)
    {
      this.retrievedDataObject = await this.backendService.retrieveFaculty(this.selectedFacultyUUID);
      this.additionalProperties = await this.getAdditionalPropertiesOnLoad("updateFaculty", this.toastNotificationService, this.backendService, this.retrievedDataObject);
      this.setSelectedLookupsDataIntoObj(this.retrievedDataObject);
      let updateFacultyRequestParamList = await this.getApiRequestParameterListCustom('updateFaculty', this.backendService, this.toastNotificationService);
      this.updateFacultySectionFields = this.getSectionFieldsFromApiRequestParams('UpdateFaculty', updateFacultyRequestParamList, this);
      this.modifyData("updateFaculty", this.retrievedDataObject, this.additionalProperties, this.toastNotificationService, this.backendService);
      this.setRetrievedObjectInfo(this.retrievedDataObject, pageApiName);



    }
  }





  setRetrievedObjectInfo(retrievedObjectInfo: any, pageApiName: any)
  {
   setTimeout(() => {
        this.updateFacultySectionData = retrievedObjectInfo;
        this.updateFacultyLookupDisplayTextMap = {};
        this.doAfterPageDataLoaded("updateFaculty", this.currentRoute, this, retrievedObjectInfo);
        this.doAfterModelLoaded("updateFaculty", this, retrievedObjectInfo);
   }, 100)
  }
  async updateFaculty()
  {
    this.isUpdateFacultyButtonDisabled = true;
    this.resetFormErrors("updateFaculty");
    this.pageErrors = []
    const requestModel: IUpdateFacultyRequestModel =
    {
      facultyUUID : this.selectedFacultyUUID,
        firstName: this.updateFacultySectionData['firstName'],
        lastName: this.updateFacultySectionData['lastName'],
        publicPic: this.updateFacultySectionData['publicPic'],
        privatePic: this.updateFacultySectionData['privatePic'],
    };
    let errorMessage : string = "";
    errorMessage += validateAttachmentSize("Public Pic", requestModel.publicPic, 1);
    errorMessage += validateAttachmentSize("Private Pic", requestModel.privatePic, 6);
    if(errorMessage.length > 0)
    {
      this.isUpdateFacultyButtonDisabled = false;
      this.toastNotificationService.showError(errorMessage, "Attachment size is more for below fields.");
      return;
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isUpdateFacultyButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("updateFaculty", requestModel, this.updateFacultySectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityUpdateResponse: IResponseMessage = await this.backendService.updateFaculty(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityUpdateResponse.success == 1)
    {
      if(!this.doAfterSave("updateFaculty", requestModel, entityUpdateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
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
          this.populateFieldLevelErrors('updateFaculty', entityUpdateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityUpdateResponse.alert);
      }
    }
    this.isUpdateFacultyButtonDisabled = false;
  }

  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any)
  {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "updateFaculty")
      this.updateFacultyLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'updateFaculty')
    {
      this.updateDependentFieldsDisplayProps(field.apiName, field.key,  selectedValue, this, this.pageSectionNameList);
    }
  }

  updateDisplayPropertyOfAField(apiName : string, key : string, selectedValue: any)
  {
  }

  hideSectionField(key : string)
  {
    let apiFieldList = [...this.updateFacultySectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.updateFacultySectionFields];
    this.displayAField(key, apiFieldList);
  }

  setSelectedLookupsDataIntoObj(retrievedObjectInfo : any) {

  }


  updateSelectOptionsData()
  {
  }
}
