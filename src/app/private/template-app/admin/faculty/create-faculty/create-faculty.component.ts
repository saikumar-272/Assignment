import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ICreateFacultyRequestModel} from 'src/app/shared/interfaces/dto/template-app/faculty/create-faculty';
import {CreateApiResponseModel} from 'src/app/shared/interfaces/dto/dto-base';
import {BackendServiceTemplateApp} from 'src/app/shared/services/backend.service.template-app';
import {YES_NO_OPTIONS} from 'src/app/shared/util/constants';
import {validateAttachmentSize} from 'src/app/shared/util/form-validators';

import {CustomisationService} from 'src/app/customisation.service';
import {FormFieldsTemplateAppImplComponent} from 'src/app/shared/forms-custom/form-fields-template-app-impl';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {ToastNotificationService} from 'src/app/toast-notification-service';

@Component({
selector: 'app-create-faculty',
  templateUrl: './create-faculty.component.html',
  styleUrls: ['./create-faculty.component.scss']
, imports: [CommonModule, RouterModule, AdminChildSectionFormComponent, NgbModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CreateFacultyComponent  extends FormFieldsTemplateAppImplComponent implements OnInit
{
  pageHeading: any = 'New Faculty'
  pageErrors: any = [];
  isCreateFacultyButtonDisabled = false;
  createFacultySectionFields: any = [];
  createFacultySectionData: any = {};
  createFacultySelectOptionsData: any = {};
  pageComponentReference: any;
  createFacultyLookupDisplayTextMap: any = {};

  sectionsShowHideInfo = {
    enableCreateFacultySection : true
  }
  yesNoOptions = YES_NO_OPTIONS;
  
  additionalProperties: any = {};
  pageSectionNameList : any[] = ["createFaculty"];
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
    this.additionalProperties = await this.getAdditionalPropertiesOnLoad("createFaculty", this.toastNotificationService, this.backendService);

    let createFacultyRequestParamList = await this.getApiRequestParameterListCustom('createFaculty', this.backendService, this.toastNotificationService);
    this.createFacultySectionFields = this.getSectionFieldsFromApiRequestParams('CreateFaculty', createFacultyRequestParamList, this);
    this.setDataToFormOnload("createFaculty", this.router, this.currentRoute, this);
    this.onPageInit("createFaculty", this.currentRoute, this, this.pageSectionNameList);
  }

  async createFaculty()
  {
    this.isCreateFacultyButtonDisabled = true;
    this.resetFormErrors("createFaculty");
    this.pageErrors = []
    const requestModel: ICreateFacultyRequestModel =
    {
        emailId: this.createFacultySectionData['emailId'],
        contactNo: this.createFacultySectionData['contactNo'],
        firstName: this.createFacultySectionData['firstName'],
        lastName: this.createFacultySectionData['lastName'],
        publicPic: this.createFacultySectionData['publicPic'],
        privatePic: this.createFacultySectionData['privatePic'],
    };
    let errorMessage : string = "";
    errorMessage += validateAttachmentSize("Public Pic", requestModel.publicPic, 1);
    errorMessage += validateAttachmentSize("Private Pic", requestModel.privatePic, 6);
    if(errorMessage.length > 0)
    {
      this.isCreateFacultyButtonDisabled = false;
      this.toastNotificationService.showError(errorMessage, "Attachment size is more for below fields.");
      return;
    }
    let numberFieldList : any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(numberFieldList, requestModel);
    if(numberValidationErrorMessage.length > 0) {
      this.isCreateFacultyButtonDisabled = false;
      this.toastNotificationService.showError(numberValidationErrorMessage, "Enter correct number for below fields.");
      return;
    }
    this.getUpdatedPayload("createFaculty", requestModel, this.createFacultySectionData, this.additionalProperties, this.toastNotificationService, this.backendService, this);
    const entityCreateResponse: CreateApiResponseModel = await this.backendService.createFaculty(requestModel);
    let toastErrorMessage = "Oops, something went wrong !!";
    if(entityCreateResponse.success == 1)
    {
      this.createFacultySectionFields = [];
      if(!this.doAfterSave("createFaculty", requestModel, entityCreateResponse, this, this.router, this.currentRoute, this.backendService, this.toastNotificationService))
      {
        return;
      }
      this.toastNotificationService.showSuccess(entityCreateResponse.alert);
      this.router.navigate(['/in/retrieve-faculty'], { queryParams: { id:  entityCreateResponse.uuid} });
    }
    else {
      if(entityCreateResponse.errors && entityCreateResponse.errors.length > 0) {
          if(entityCreateResponse.alert && entityCreateResponse.alert.length > 0) {
              toastErrorMessage = entityCreateResponse.alert;
          }
          this.toastNotificationService.showError(toastErrorMessage);
          this.pageErrors = this.getPageErrors(entityCreateResponse.errors)
          this.populateFieldLevelErrors('createFaculty', entityCreateResponse.errors)
      } else {
          this.toastNotificationService.showError(entityCreateResponse.alert);
      }
    }
    this.isCreateFacultyButtonDisabled = false;
  }
  async onLookupValueSelected(selectedValue: any, field : any, selectedRecord: any) {
    this.updateLookupDisplayTextMap(field['apiName'], field['key'], selectedRecord?.value);
    if(true === field.showHideDependentFields || 'true' === field.showHideDependentFields)
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateLookupDisplayTextMap(fieldApiName : string, fieldKey : string, selectedValue: any)
  {
    if(this.toInitLower(fieldApiName) === "createFaculty")
      this.createFacultyLookupDisplayTextMap[fieldKey] = selectedValue;
  }

  updateDisplayPropertyOfFields(selectedValue: any, field : any)
  {
    if(field.apiName === 'createFaculty')
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
    let apiFieldList = [...this.createFacultySectionFields];
    this.hideAField(key, apiFieldList);
  }

  displaySectionField(key : string)
  {
    let apiFieldList = [...this.createFacultySectionFields];
    this.displayAField(key, apiFieldList);
  }




  updateSelectOptionsData()
  {
  }

}
