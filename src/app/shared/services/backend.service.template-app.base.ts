import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {toFormData} from '../util/http-util';
import {
    CreateApiResponseModel,
    IResponseMessage,
    IUploadDataRequestModel,
    RetrieveListResponseModel
} from '../interfaces/dto/dto-base';
import {Observable} from 'rxjs';
import {ICreateNewStaffUserRequestModel} from '../interfaces/dto/template-app/user-info/create-new-staff-user';
import {IRetrieveUserInfoDto} from '../interfaces/dto/template-app/user-info/retrieve-user-info';
import {retrieveUserInfoListSearchFilter} from '../interfaces/dto/template-app/user-info/retrieve-user-info-list';
import {IViewProfileDto} from '../interfaces/dto/template-app/user-profile/view-profile';
import {IUploadProfilePictureRequestModel} from '../interfaces/dto/template-app/user-profile/upload-profile-picture';
import {IUpdatePasswordByAdminRequestModel} from '../interfaces/dto/template-app/user-info/update-password-by-admin';
import {
    IUpdatePrivilegeGroupItemsRequestModel
} from '../interfaces/dto/template-app/privilege-group/update-privilege-group-items';
import {
    retrievePrivilegeGroupItemListSearchFilter
} from '../interfaces/dto/template-app/privilege-group-item/retrieve-privilege-group-item-list';
import {
    IRetrieveProfileDetailsSSStaffDto
} from '../interfaces/dto/template-app/user-info/retrieve-profile-details-ss-staff';
import {
    IUpdateProfileDetailsSSStaffRequestModel
} from '../interfaces/dto/template-app/user-info/update-profile-details-ss-staff';
import {
    IUpdateProfileDetailsSSApplicationUserRequestModel
} from '../interfaces/dto/template-app/self-service-user/update-profile-details-ss-application-user';
import {
    IUpdateContactNoSSApplicationUserRequestModel
} from '../interfaces/dto/template-app/self-service-user/update-contact-no-ss-application-user';
import {
    IUpdateEmailSSApplicationUserRequestModel
} from '../interfaces/dto/template-app/self-service-user/update-email-ss-application-user';
import {
    IUpdatePasswordSSApplicationUserRequestModel
} from '../interfaces/dto/template-app/self-service-user/update-password-ss-application-user';
import {
    IValidateLoginDetailsRequestModel,
    IValidateLoginDetailsResponseModel
} from '../interfaces/dto/template-app/application-user/validate-login-details';
import {
    IUpdateEmployeeAllDetailsResponseModel
} from '../interfaces/dto/template-app/employee-details-update/update-employee-all-details';
import {
    IUpdateEmployeeBasicDetailsRequestModel
} from '../interfaces/dto/template-app/employee-details-update/update-employee-basic-details';
import {
    IUpdateEmployeeAttachmentsRequestModel
} from '../interfaces/dto/template-app/employee-details-update/update-employee-attachments';
import {
    IRetrieveEmployeeBasicDetailsDto
} from '../interfaces/dto/template-app/employee-details-retrieve/retrieve-employee-basic-details';
import {
    retrieveEmployeeBasicDetailsListSearchFilter
} from '../interfaces/dto/template-app/employee-details-retrieve/retrieve-employee-basic-details-list';
import {IUpdateEmployeeSSRequestModel} from '../interfaces/dto/template-app/employee/update-employee-ss';
import {IUpdateEmpLocationNameRequestModel} from '../interfaces/dto/template-app/emp-location/update-emp-location-name';
import {IUpdateStudentAllDetailsRequestModel} from '../interfaces/dto/template-app/student/update-student-all-details';
import {IUpdateStudentFirstNameRequestModel} from '../interfaces/dto/template-app/student/update-student-first-name';
import {retrieveEmployeeListSearchFilter} from '../interfaces/dto/template-app/employee/retrieve-employee-list';
import {IUpdateStudentByIdsRequestModel} from '../interfaces/dto/template-app/student/update-student-by-ids';
import {retrieveStudentListSearchFilter} from '../interfaces/dto/template-app/student/retrieve-student-list';
import {
    ISendSmsToSelectedStudentsRequestModel
} from '../interfaces/dto/template-app/student/send-sms-to-selected-students';
import {
    getApiCustomFormFieldListSearchFilter
} from '../interfaces/dto/template-app/custom-form-field/get-api-custom-form-field-list';
import {
    ICreateCustomFormFieldRequestModel
} from '../interfaces/dto/template-app/custom-form-field/create-custom-form-field';
import {
    IUpdateCustomFormFieldRequestModel
} from '../interfaces/dto/template-app/custom-form-field/update-custom-form-field';
import {getStudentGraphDataSearchFilter} from '../interfaces/dto/template-app/student/get-student-graph-data';
import {
    ICreateStudentForFlexfieldsRequestModel
} from '../interfaces/dto/template-app/student/create-student-for-flexfields';
import {
    ICreateEmployeeForFlexfieldsRequestModel
} from '../interfaces/dto/template-app/employee/create-employee-for-flexfields';
import {
    retrieveStudentListForFacultySearchFilter
} from '../interfaces/dto/template-app/student/retrieve-student-list-for-faculty';
import {
    retrieveStudentExamResultListForFacultySearchFilter
} from '../interfaces/dto/template-app/student-exam-result/retrieve-student-exam-result-list-for-faculty';
import {
    retrieveFlexfieldContextSegmentsMapSearchFilter
} from '../interfaces/dto/template-app/flexfield-segment/retrieve-flexfield-context-segments-map';
import {
    retrieveStudentListWithJoinSearchFilter
} from '../interfaces/dto/template-app/student/retrieve-student-list-with-join';
import {
    IUpdatePasswordForFacultyRequestModel
} from '../interfaces/dto/template-app/faculty/update-password-for-faculty';
import {
    IUpdateProfileDetailsForFacultyRequestModel
} from '../interfaces/dto/template-app/faculty/update-profile-details-for-faculty';
import {
    IMakeFeePaymentRequestModel,
    IMakeFeePaymentResponseModel
} from '../interfaces/dto/template-app/student/make-fee-payment';
import {
    ICreateStudentFeePaymentRequestModel
} from '../interfaces/dto/template-app/student-fee-payment/create-student-fee-payment';
import {
    IUpdateStudentFeePaymentStatusRequestModel
} from '../interfaces/dto/template-app/student-fee-payment/update-student-fee-payment-status';
import {
    retrieveMaleGenderStudentsSearchFilter
} from '../interfaces/dto/template-app/student/retrieve-male-gender-students';
import {
    ICorrelateEmailNotificationTestRequestModel
} from '../interfaces/dto/template-app/email-notification-test/correlate-email-notification-test';
import {
    IGetUpdatedApiParametersRequestModel,
    IGetUpdatedApiParametersResponseModel
} from '../interfaces/dto/template-app/api-parameters/get-updated-api-parameters';
import {ICreateStudentRequestModel} from '../interfaces/dto/template-app/student/create-student';
import {IRetrieveStudentDto} from '../interfaces/dto/template-app/student/retrieve-student';
import {
    ICreateCostCenterLineItemRequestModel
} from '../interfaces/dto/template-app/cost-center-line-item/create-cost-center-line-item';
import {
    retrieveCostCenterLineItemListSearchFilter
} from '../interfaces/dto/template-app/cost-center-line-item/retrieve-cost-center-line-item-list';
import {
    IUpdateCostCenterLineItemRequestModel
} from '../interfaces/dto/template-app/cost-center-line-item/update-cost-center-line-item';
import {
    IRetrieveCostCenterLineItemDto
} from '../interfaces/dto/template-app/cost-center-line-item/retrieve-cost-center-line-item';
import {
    ICreateEmployeeSectionRequestModel
} from '../interfaces/dto/template-app/employee-section/create-employee-section';
import {
    retrieveEmployeeSectionListSearchFilter
} from '../interfaces/dto/template-app/employee-section/retrieve-employee-section-list';
import {
    IUpdateEmployeeSectionRequestModel
} from '../interfaces/dto/template-app/employee-section/update-employee-section';
import {IRetrieveEmployeeSectionDto} from '../interfaces/dto/template-app/employee-section/retrieve-employee-section';
import {retrieveFacultyListSearchFilter} from '../interfaces/dto/template-app/faculty/retrieve-faculty-list';
import {IUpdateAgeAndGenderRequestModel} from '../interfaces/dto/template-app/student/update-age-and-gender';
import {IUpdateEmployeeNameRequestModel} from '../interfaces/dto/template-app/employee/update-employee-name';
import {
    retrieveUploadPersonListSearchFilter
} from '../interfaces/dto/template-app/upload-person/retrieve-upload-person-list';
import {IGetSellerDataForRegistrationDto} from '../interfaces/dto/template-app/seller/get-seller-data-for-registration';
import {retrieveParentListSearchFilter} from '../interfaces/dto/template-app/parent/retrieve-parent-list';
import {
    IUpdateParentsMobileNumberRequestModel
} from '../interfaces/dto/template-app/parent/update-parents-mobile-number';
import {IUpdateUserInfoRequestModel} from '../interfaces/dto/template-app/user-info/update-user-info';
import {ICreatePrivilegeGroupRequestModel} from '../interfaces/dto/template-app/privilege-group/create-privilege-group';
import {IUpdatePrivilegeGroupRequestModel} from '../interfaces/dto/template-app/privilege-group/update-privilege-group';
import {IRetrievePrivilegeGroupDto} from '../interfaces/dto/template-app/privilege-group/retrieve-privilege-group';
import {
    retrievePrivilegeGroupListSearchFilter
} from '../interfaces/dto/template-app/privilege-group/retrieve-privilege-group-list';
import {ICreateUserRoleRequestModel} from '../interfaces/dto/template-app/user-role/create-user-role';
import {IRetrieveUserRoleDto} from '../interfaces/dto/template-app/user-role/retrieve-user-role';
import {retrieveUserRoleListSearchFilter} from '../interfaces/dto/template-app/user-role/retrieve-user-role-list';
import {ICreateEmployeeRequestModel} from '../interfaces/dto/template-app/employee/create-employee';
import {IUpdateEmployeeRequestModel} from '../interfaces/dto/template-app/employee/update-employee';
import {IRetrieveEmployeeDto} from '../interfaces/dto/template-app/employee/retrieve-employee';
import {ICreateEmpLocationRequestModel} from '../interfaces/dto/template-app/emp-location/create-emp-location';
import {IUpdateEmpLocationRequestModel} from '../interfaces/dto/template-app/emp-location/update-emp-location';
import {IRetrieveEmpLocationDto} from '../interfaces/dto/template-app/emp-location/retrieve-emp-location';
import {
    retrieveEmpLocationListSearchFilter
} from '../interfaces/dto/template-app/emp-location/retrieve-emp-location-list';
import {ICreateEmpDependentRequestModel} from '../interfaces/dto/template-app/emp-dependent/create-emp-dependent';
import {IUpdateEmpDependentRequestModel} from '../interfaces/dto/template-app/emp-dependent/update-emp-dependent';
import {IRetrieveEmpDependentDto} from '../interfaces/dto/template-app/emp-dependent/retrieve-emp-dependent';
import {
    retrieveEmpDependentListSearchFilter
} from '../interfaces/dto/template-app/emp-dependent/retrieve-emp-dependent-list';
import {ICreateTaxTypeRequestModel} from '../interfaces/dto/template-app/tax-type/create-tax-type';
import {IUpdateTaxTypeRequestModel} from '../interfaces/dto/template-app/tax-type/update-tax-type';
import {IRetrieveTaxTypeDto} from '../interfaces/dto/template-app/tax-type/retrieve-tax-type';
import {retrieveTaxTypeListSearchFilter} from '../interfaces/dto/template-app/tax-type/retrieve-tax-type-list';
import {ICreateTaxAccountRequestModel} from '../interfaces/dto/template-app/tax-account/create-tax-account';
import {IUpdateTaxAccountRequestModel} from '../interfaces/dto/template-app/tax-account/update-tax-account';
import {IRetrieveTaxAccountDto} from '../interfaces/dto/template-app/tax-account/retrieve-tax-account';
import {retrieveTaxAccountListSearchFilter} from '../interfaces/dto/template-app/tax-account/retrieve-tax-account-list';
import {ICreateSalesInvoice2RequestModel} from '../interfaces/dto/template-app/sales-invoice2/create-sales-invoice2';
import {IUpdateSalesInvoice2RequestModel} from '../interfaces/dto/template-app/sales-invoice2/update-sales-invoice2';
import {IRetrieveSalesInvoice2Dto} from '../interfaces/dto/template-app/sales-invoice2/retrieve-sales-invoice2';
import {
    retrieveSalesInvoice2ListSearchFilter
} from '../interfaces/dto/template-app/sales-invoice2/retrieve-sales-invoice2-list';
import {ICreateOrganisationRequestModel} from '../interfaces/dto/template-app/organisation/create-organisation';
import {IUpdateOrganisationRequestModel} from '../interfaces/dto/template-app/organisation/update-organisation';
import {IRetrieveOrganisationDto} from '../interfaces/dto/template-app/organisation/retrieve-organisation';
import {
    retrieveOrganisationListSearchFilter
} from '../interfaces/dto/template-app/organisation/retrieve-organisation-list';
import {ICreatePersonRequestModel} from '../interfaces/dto/template-app/person/create-person';
import {IUpdatePersonRequestModel} from '../interfaces/dto/template-app/person/update-person';
import {IRetrievePersonDto} from '../interfaces/dto/template-app/person/retrieve-person';
import {retrievePersonListSearchFilter} from '../interfaces/dto/template-app/person/retrieve-person-list';
import {ICreateBuyerRequestModel} from '../interfaces/dto/template-app/buyer/create-buyer';
import {IUpdateBuyerRequestModel} from '../interfaces/dto/template-app/buyer/update-buyer';
import {IRetrieveBuyerDto} from '../interfaces/dto/template-app/buyer/retrieve-buyer';
import {retrieveBuyerListSearchFilter} from '../interfaces/dto/template-app/buyer/retrieve-buyer-list';
import {ICreateSellerRequestModel} from '../interfaces/dto/template-app/seller/create-seller';
import {IUpdateSellerRequestModel} from '../interfaces/dto/template-app/seller/update-seller';
import {IRetrieveSellerDto} from '../interfaces/dto/template-app/seller/retrieve-seller';
import {retrieveSellerListSearchFilter} from '../interfaces/dto/template-app/seller/retrieve-seller-list';
import {ICreateSalesInvoiceRequestModel} from '../interfaces/dto/template-app/sales-invoice/create-sales-invoice';
import {IUpdateSalesInvoiceRequestModel} from '../interfaces/dto/template-app/sales-invoice/update-sales-invoice';
import {IRetrieveSalesInvoiceDto} from '../interfaces/dto/template-app/sales-invoice/retrieve-sales-invoice';
import {
    retrieveSalesInvoiceListSearchFilter
} from '../interfaces/dto/template-app/sales-invoice/retrieve-sales-invoice-list';
import {
    ICreateInvoiceLineItemRequestModel
} from '../interfaces/dto/template-app/invoice-line-item/create-invoice-line-item';
import {
    IUpdateInvoiceLineItemRequestModel
} from '../interfaces/dto/template-app/invoice-line-item/update-invoice-line-item';
import {IRetrieveInvoiceLineItemDto} from '../interfaces/dto/template-app/invoice-line-item/retrieve-invoice-line-item';
import {
    retrieveInvoiceLineItemListSearchFilter
} from '../interfaces/dto/template-app/invoice-line-item/retrieve-invoice-line-item-list';
import {IUpdateStudentRequestModel} from '../interfaces/dto/template-app/student/update-student';
import {ICreateFacultyRequestModel} from '../interfaces/dto/template-app/faculty/create-faculty';
import {IUpdateFacultyRequestModel} from '../interfaces/dto/template-app/faculty/update-faculty';
import {IRetrieveFacultyDto} from '../interfaces/dto/template-app/faculty/retrieve-faculty';
import {
    ICreateStudentExamResultRequestModel
} from '../interfaces/dto/template-app/student-exam-result/create-student-exam-result';
import {
    IUpdateStudentExamResultRequestModel
} from '../interfaces/dto/template-app/student-exam-result/update-student-exam-result';
import {
    IRetrieveStudentExamResultDto
} from '../interfaces/dto/template-app/student-exam-result/retrieve-student-exam-result';
import {
    retrieveStudentExamResultListSearchFilter
} from '../interfaces/dto/template-app/student-exam-result/retrieve-student-exam-result-list';
import {IRetrieveCustomFormFieldDto} from '../interfaces/dto/template-app/custom-form-field/retrieve-custom-form-field';
import {ICreateFormFieldApiRequestModel} from '../interfaces/dto/template-app/form-field-api/create-form-field-api';
import {IUpdateFormFieldApiRequestModel} from '../interfaces/dto/template-app/form-field-api/update-form-field-api';
import {IRetrieveFormFieldApiDto} from '../interfaces/dto/template-app/form-field-api/retrieve-form-field-api';
import {
    retrieveFormFieldApiListSearchFilter
} from '../interfaces/dto/template-app/form-field-api/retrieve-form-field-api-list';
import {IUpdateFlexFieldRequestModel} from '../interfaces/dto/template-app/flex-field/update-flex-field';
import {IRetrieveFlexFieldDto} from '../interfaces/dto/template-app/flex-field/retrieve-flex-field';
import {retrieveFlexFieldListSearchFilter} from '../interfaces/dto/template-app/flex-field/retrieve-flex-field-list';
import {
    ICreateFlexfieldContextValueRequestModel
} from '../interfaces/dto/template-app/flexfield-context-value/create-flexfield-context-value';
import {
    IUpdateFlexfieldContextValueRequestModel
} from '../interfaces/dto/template-app/flexfield-context-value/update-flexfield-context-value';
import {
    IRetrieveFlexfieldContextValueDto
} from '../interfaces/dto/template-app/flexfield-context-value/retrieve-flexfield-context-value';
import {
    retrieveFlexfieldContextValueListSearchFilter
} from '../interfaces/dto/template-app/flexfield-context-value/retrieve-flexfield-context-value-list';
import {
    ICreateFlexfieldSegmentRequestModel
} from '../interfaces/dto/template-app/flexfield-segment/create-flexfield-segment';
import {
    IUpdateFlexfieldSegmentRequestModel
} from '../interfaces/dto/template-app/flexfield-segment/update-flexfield-segment';
import {
    IRetrieveFlexfieldSegmentDto
} from '../interfaces/dto/template-app/flexfield-segment/retrieve-flexfield-segment';
import {
    retrieveFlexfieldSegmentListSearchFilter
} from '../interfaces/dto/template-app/flexfield-segment/retrieve-flexfield-segment-list';
import {ICreateCountryRequestModel} from '../interfaces/dto/template-app/country/create-country';
import {IUpdateCountryRequestModel} from '../interfaces/dto/template-app/country/update-country';
import {IRetrieveCountryDto} from '../interfaces/dto/template-app/country/retrieve-country';
import {retrieveCountryListSearchFilter} from '../interfaces/dto/template-app/country/retrieve-country-list';
import {ICreateStateRequestModel} from '../interfaces/dto/template-app/state/create-state';
import {IUpdateStateRequestModel} from '../interfaces/dto/template-app/state/update-state';
import {IRetrieveStateDto} from '../interfaces/dto/template-app/state/retrieve-state';
import {retrieveStateListSearchFilter} from '../interfaces/dto/template-app/state/retrieve-state-list';
import {ICreateAssetRequestModel} from '../interfaces/dto/template-app/asset/create-asset';
import {IUpdateAssetRequestModel} from '../interfaces/dto/template-app/asset/update-asset';
import {IRetrieveAssetDto} from '../interfaces/dto/template-app/asset/retrieve-asset';
import {retrieveAssetListSearchFilter} from '../interfaces/dto/template-app/asset/retrieve-asset-list';
import {ICreateAssetComponentRequestModel} from '../interfaces/dto/template-app/asset-component/create-asset-component';
import {IUpdateAssetComponentRequestModel} from '../interfaces/dto/template-app/asset-component/update-asset-component';
import {IRetrieveAssetComponentDto} from '../interfaces/dto/template-app/asset-component/retrieve-asset-component';
import {
    retrieveAssetComponentListSearchFilter
} from '../interfaces/dto/template-app/asset-component/retrieve-asset-component-list';
import {ICreateComponentSpareRequestModel} from '../interfaces/dto/template-app/component-spare/create-component-spare';
import {IUpdateComponentSpareRequestModel} from '../interfaces/dto/template-app/component-spare/update-component-spare';
import {IRetrieveComponentSpareDto} from '../interfaces/dto/template-app/component-spare/retrieve-component-spare';
import {
    retrieveComponentSpareListSearchFilter
} from '../interfaces/dto/template-app/component-spare/retrieve-component-spare-list';
import {ICreateClassInfoRequestModel} from '../interfaces/dto/template-app/class-info/create-class-info';
import {retrieveClassInfoListSearchFilter} from '../interfaces/dto/template-app/class-info/retrieve-class-info-list';
import {ICreateSectionRequestModel} from '../interfaces/dto/template-app/section/create-section';
import {IUpdateSectionRequestModel} from '../interfaces/dto/template-app/section/update-section';
import {IRetrieveSectionDto} from '../interfaces/dto/template-app/section/retrieve-section';
import {retrieveSectionListSearchFilter} from '../interfaces/dto/template-app/section/retrieve-section-list';
import {
    ICreateEmailNotificationTestRequestModel
} from '../interfaces/dto/template-app/email-notification-test/create-email-notification-test';
import {
    IUpdateEmailNotificationTestRequestModel
} from '../interfaces/dto/template-app/email-notification-test/update-email-notification-test';
import {
    IRetrieveEmailNotificationTestDto
} from '../interfaces/dto/template-app/email-notification-test/retrieve-email-notification-test';
import {
    retrieveEmailNotificationTestListSearchFilter
} from '../interfaces/dto/template-app/email-notification-test/retrieve-email-notification-test-list';
import {ICreateParentRequestModel} from '../interfaces/dto/template-app/parent/create-parent';
import {IUpdateParentRequestModel} from '../interfaces/dto/template-app/parent/update-parent';
import {IRetrieveParentDto} from '../interfaces/dto/template-app/parent/retrieve-parent';
import {ICreateChildRequestModel} from '../interfaces/dto/template-app/child/create-child';
import {IUpdateChildRequestModel} from '../interfaces/dto/template-app/child/update-child';
import {IRetrieveChildDto} from '../interfaces/dto/template-app/child/retrieve-child';
import {retrieveChildListSearchFilter} from '../interfaces/dto/template-app/child/retrieve-child-list';
import {
    ICreateParentMobileNumberRequestModel
} from '../interfaces/dto/template-app/parent-mobile-number/create-parent-mobile-number';
import {
    IUpdateParentMobileNumberRequestModel
} from '../interfaces/dto/template-app/parent-mobile-number/update-parent-mobile-number';
import {
    IRetrieveParentMobileNumberDto
} from '../interfaces/dto/template-app/parent-mobile-number/retrieve-parent-mobile-number';
import {
    retrieveParentMobileNumberListSearchFilter
} from '../interfaces/dto/template-app/parent-mobile-number/retrieve-parent-mobile-number-list';
import {ICreateEmployeeUpdateRequestModel} from '../interfaces/dto/template-app/employee-update/create-employee-update';
import {ICreateUploadPersonRequestModel} from '../interfaces/dto/template-app/upload-person/create-upload-person';
import {IUpdateUploadPersonRequestModel} from '../interfaces/dto/template-app/upload-person/update-upload-person';
import {IRetrieveUploadPersonDto} from '../interfaces/dto/template-app/upload-person/retrieve-upload-person';
import {
    ICreateStateForUploadRequestModel
} from '../interfaces/dto/template-app/state-for-upload/create-state-for-upload';
import {
    IUpdateStateForUploadRequestModel
} from '../interfaces/dto/template-app/state-for-upload/update-state-for-upload';
import {IRetrieveStateForUploadDto} from '../interfaces/dto/template-app/state-for-upload/retrieve-state-for-upload';
import {
    retrieveStateForUploadListSearchFilter
} from '../interfaces/dto/template-app/state-for-upload/retrieve-state-for-upload-list';
import {
    ICreateCounryForUploadRequestModel
} from '../interfaces/dto/template-app/counry-for-upload/create-counry-for-upload';
import {
    IUpdateCounryForUploadRequestModel
} from '../interfaces/dto/template-app/counry-for-upload/update-counry-for-upload';
import {IRetrieveCounryForUploadDto} from '../interfaces/dto/template-app/counry-for-upload/retrieve-counry-for-upload';
import {
    retrieveCounryForUploadListSearchFilter
} from '../interfaces/dto/template-app/counry-for-upload/retrieve-counry-for-upload-list';
import {ICreateStudentLeaveRequestModel} from '../interfaces/dto/template-app/student-leave/create-student-leave';
import {IUpdateStudentLeaveRequestModel} from '../interfaces/dto/template-app/student-leave/update-student-leave';
import {IRetrieveStudentLeaveDto} from '../interfaces/dto/template-app/student-leave/retrieve-student-leave';
import {
    retrieveStudentLeaveListSearchFilter
} from '../interfaces/dto/template-app/student-leave/retrieve-student-leave-list';
import {
    IUpdateSelfServiceAccessForFacultyRequestModel
} from '../interfaces/dto/template-app/faculty/update-self-service-access-for-faculty';
import {DomainService} from './domain.service';
import {BackendServiceBase} from './backend.service.base';

export class BackendServiceTemplateAppBase extends BackendServiceBase{

  constructor(http: HttpClient, domainService: DomainService) {
    super(http, domainService);
  }

  async uploadUploadPerson(uploadDataRequestModel: IUploadDataRequestModel): Promise<IResponseMessage> {
        try
        {
          if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
          const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/upload-person/upload'), toFormData(uploadDataRequestModel), {headers : this.getHeaders("uploadUploadPerson")}).toPromise();
          if(this.redirectApiToAnotherServer(response)) {
            return this.uploadUploadPerson(uploadDataRequestModel);
          }
          return response;
        }
        catch (error)
        {
          this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
          console.log(error);
          return (<HttpErrorResponse>error).error;
        }
      }

  async uploadStateForUpload(uploadDataRequestModel: IUploadDataRequestModel): Promise<IResponseMessage> {
        try
        {
          if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
          const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/state-for-upload/upload'), toFormData(uploadDataRequestModel), {headers : this.getHeaders("uploadStateForUpload")}).toPromise();
          if(this.redirectApiToAnotherServer(response)) {
            return this.uploadStateForUpload(uploadDataRequestModel);
          }
          return response;
        }
        catch (error)
        {
          this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
          console.log(error);
          return (<HttpErrorResponse>error).error;
        }
      }

  async uploadCounryForUpload(uploadDataRequestModel: IUploadDataRequestModel): Promise<IResponseMessage> {
        try
        {
          if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
          const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/counry-for-upload/upload'), toFormData(uploadDataRequestModel), {headers : this.getHeaders("uploadCounryForUpload")}).toPromise();
          if(this.redirectApiToAnotherServer(response)) {
            return this.uploadCounryForUpload(uploadDataRequestModel);
          }
          return response;
        }
        catch (error)
        {
          this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
          console.log(error);
          return (<HttpErrorResponse>error).error;
        }
      }


  async createNewStaffUser(createNewStaffUserRequestModel: ICreateNewStaffUserRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/user-info/create-new-staff-user'), createNewStaffUserRequestModel, {headers : this.getHeaders("createNewStaffUser")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createNewStaffUser(createNewStaffUserRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveUserInfo(userInfoUUID : string): Promise<IRetrieveUserInfoDto>
  {
    const params = new HttpParams()
      .append('userInfoUUID', userInfoUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveUserInfoDto = <IRetrieveUserInfoDto>await this.http.get(this.getApiUrl('/user-info/retrieve'), { params: params, headers : this.getHeaders("retrieveUserInfo") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveUserInfo(userInfoUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveUserInfoList(searchCriteria: retrieveUserInfoListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.emailId != null) params = params.append("emailId", searchCriteria.emailId);
    if (searchCriteria.contactNo != null) params = params.append("contactNo", searchCriteria.contactNo);
    if (searchCriteria.userInfoUUID != null) params = params.append("userInfoUUID", searchCriteria.userInfoUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/user-info/retrieve-list'), { params: params, headers : this.getHeaders("retrieveUserInfoList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveUserInfoList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async viewProfile(): Promise<IViewProfileDto>
  {
    const params = new HttpParams()
      ;

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IViewProfileDto = <IViewProfileDto>await this.http.get(this.getApiUrl('/user-profile/view-profile'), { params: params, headers : this.getHeaders("viewProfile") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.viewProfile();
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async uploadProfilePicture(uploadProfilePictureRequestModel: IUploadProfilePictureRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-profile/upload-profile-picture'), toFormData(uploadProfilePictureRequestModel), {headers : this.getHeaders("uploadProfilePicture")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.uploadProfilePicture(uploadProfilePictureRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updatePasswordByAdmin(updatePasswordByAdminRequestModel: IUpdatePasswordByAdminRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-info/update-password-by-admin'), updatePasswordByAdminRequestModel, {headers : this.getHeaders("updatePasswordByAdmin")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updatePasswordByAdmin(updatePasswordByAdminRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmailByAdmin(userInfoUUID : string, newEmail : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-info/update-email-by-admin'), toFormData({userInfoUUID, newEmail}), {headers : this.getHeaders("updateEmailByAdmin")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmailByAdmin(userInfoUUID, newEmail);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateContactByAdmin(userInfoUUID : string, newContactNo : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-info/update-contact-by-admin'), toFormData({userInfoUUID, newContactNo}), {headers : this.getHeaders("updateContactByAdmin")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateContactByAdmin(userInfoUUID, newContactNo);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updatePrivilegeGroupItems(updatePrivilegeGroupItemsRequestModel: IUpdatePrivilegeGroupItemsRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/privilege-group/update-privilege-group-items'), updatePrivilegeGroupItemsRequestModel, {headers : this.getHeaders("updatePrivilegeGroupItems")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updatePrivilegeGroupItems(updatePrivilegeGroupItemsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrievePrivilegeGroupItemList(searchCriteria: retrievePrivilegeGroupItemListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.privilegeGroupItemUUID != null) params = params.append("privilegeGroupItemUUID", searchCriteria.privilegeGroupItemUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    if (searchCriteria.privilegeGroupUUID != null) params = params.append("privilegeGroupUUID", searchCriteria.privilegeGroupUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/privilege-group-item/retrieve-privilege-group-item-list'), { params: params, headers : this.getHeaders("retrievePrivilegeGroupItemList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrievePrivilegeGroupItemList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveProfileDetailsSSStaff(): Promise<IRetrieveProfileDetailsSSStaffDto>
  {
    const params = new HttpParams()
      ;

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveProfileDetailsSSStaffDto = <IRetrieveProfileDetailsSSStaffDto>await this.http.get(this.getApiUrl('/user-info/retrieve-profile-details-ss-staff'), { params: params, headers : this.getHeaders("retrieveProfileDetailsSSStaff") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveProfileDetailsSSStaff();
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateProfileDetailsSSStaff(updateProfileDetailsSSStaffRequestModel: IUpdateProfileDetailsSSStaffRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-info/update-profile-details-ss-staff'), updateProfileDetailsSSStaffRequestModel, {headers : this.getHeaders("updateProfileDetailsSSStaff")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateProfileDetailsSSStaff(updateProfileDetailsSSStaffRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateProfileDetailsSSApplicationUser(updateProfileDetailsSSApplicationUserRequestModel: IUpdateProfileDetailsSSApplicationUserRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/self-service-user/update-profile-details-ss-application-user'), updateProfileDetailsSSApplicationUserRequestModel, {headers : this.getHeaders("updateProfileDetailsSSApplicationUser")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateProfileDetailsSSApplicationUser(updateProfileDetailsSSApplicationUserRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async sendOtpForNewContactNumberSSApplicationUser(contactNo : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/self-service-user/send-otp-for-new-contact-number-ss-application-user'), toFormData({contactNo}), {headers : this.getHeaders("sendOtpForNewContactNumberSSApplicationUser")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.sendOtpForNewContactNumberSSApplicationUser(contactNo);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateContactNoSSApplicationUser(updateContactNoSSApplicationUserRequestModel: IUpdateContactNoSSApplicationUserRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/self-service-user/update-contact-no-ss-application-user'), updateContactNoSSApplicationUserRequestModel, {headers : this.getHeaders("updateContactNoSSApplicationUser")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateContactNoSSApplicationUser(updateContactNoSSApplicationUserRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmailSSApplicationUser(updateEmailSSApplicationUserRequestModel: IUpdateEmailSSApplicationUserRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/self-service-user/update-email-ss-application-user'), updateEmailSSApplicationUserRequestModel, {headers : this.getHeaders("updateEmailSSApplicationUser")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmailSSApplicationUser(updateEmailSSApplicationUserRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updatePasswordSSApplicationUser(updatePasswordSSApplicationUserRequestModel: IUpdatePasswordSSApplicationUserRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/self-service-user/update-password-ss-application-user'), updatePasswordSSApplicationUserRequestModel, {headers : this.getHeaders("updatePasswordSSApplicationUser")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updatePasswordSSApplicationUser(updatePasswordSSApplicationUserRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async validateLoginDetails(validateLoginDetailsRequestModel: IValidateLoginDetailsRequestModel): Promise<IValidateLoginDetailsResponseModel> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IValidateLoginDetailsResponseModel = <IValidateLoginDetailsResponseModel>await this.http.post(this.getApiUrl('/application-user/validate-login-details'), validateLoginDetailsRequestModel, {headers : this.getHeaders("validateLoginDetails")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.validateLoginDetails(validateLoginDetailsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmployeeAllDetails(employeeUUID : string, firstName : string, lastName : string, emailId : string, joininigDate : string, gender : string, dateTimeField : string, dateTimeWithSecondsField : string, timeField : string, timeWithSecondsField : string, noOfChildren : number, salary : number, hike : number, objectId : number, locationUUID: string, experience : number, isUserValidated : boolean): Promise<IUpdateEmployeeAllDetailsResponseModel> {
    try 
    {    
      let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IUpdateEmployeeAllDetailsResponseModel = <IUpdateEmployeeAllDetailsResponseModel>await this.http.post(this.getApiUrl('/employee-details-update/update-employee-all-details'), toFormData({employeeUUID, firstName, lastName, emailId, joininigDate, gender, dateTimeField, dateTimeWithSecondsField, timeField, timeWithSecondsField, noOfChildren, salary, hike, objectId, locationUUID, experience, isUserValidated ,timeZone}), {headers : this.getHeaders("updateEmployeeAllDetails")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployeeAllDetails(employeeUUID, firstName, lastName, emailId, joininigDate, gender, dateTimeField, dateTimeWithSecondsField, timeField, timeWithSecondsField, noOfChildren, salary, hike, objectId, locationUUID, experience, isUserValidated);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmployeeBasicDetails(updateEmployeeBasicDetailsRequestModel: IUpdateEmployeeBasicDetailsRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee-details-update/update-employee-basic-details'), updateEmployeeBasicDetailsRequestModel, {headers : this.getHeaders("updateEmployeeBasicDetails")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployeeBasicDetails(updateEmployeeBasicDetailsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmployeeAttachments(updateEmployeeAttachmentsRequestModel: IUpdateEmployeeAttachmentsRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee-details-update/update-employee-attachments'), toFormData(updateEmployeeAttachmentsRequestModel), {headers : this.getHeaders("updateEmployeeAttachments")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployeeAttachments(updateEmployeeAttachmentsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmployeeBasicDetails(employeeUUID : string): Promise<IRetrieveEmployeeBasicDetailsDto>
  {
    const params = new HttpParams()
      .append('employeeUUID', employeeUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveEmployeeBasicDetailsDto = <IRetrieveEmployeeBasicDetailsDto>await this.http.get(this.getApiUrl('/employee-details-retrieve/retrieve-employee-basic-details'), { params: params, headers : this.getHeaders("retrieveEmployeeBasicDetails") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmployeeBasicDetails(employeeUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveEmployeeBasicDetailsList(searchCriteria: retrieveEmployeeBasicDetailsListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.employeeUUID != null) params = params.append("employeeUUID", searchCriteria.employeeUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/employee-details-retrieve/retrieve-employee-basic-details-list'), { params: params, headers : this.getHeaders("retrieveEmployeeBasicDetailsList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmployeeBasicDetailsList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateEmployeeSS(updateEmployeeSSRequestModel: IUpdateEmployeeSSRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee/update-employee-ss'), toFormData(updateEmployeeSSRequestModel), {headers : this.getHeaders("updateEmployeeSS")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployeeSS(updateEmployeeSSRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmpLocationName(updateEmpLocationNameRequestModel: IUpdateEmpLocationNameRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/emp-location/update-emp-location-name'), updateEmpLocationNameRequestModel, {headers : this.getHeaders("updateEmpLocationName")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmpLocationName(updateEmpLocationNameRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async verifyEmpLocation(empLocationUUID : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/emp-location/verify-emp-location'), toFormData({empLocationUUID}), {headers : this.getHeaders("verifyEmpLocation")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.verifyEmpLocation(empLocationUUID);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateStudentAllDetails(updateStudentAllDetailsRequestModel: IUpdateStudentAllDetailsRequestModel): Promise<IResponseMessage> {
    try 
    {    
      updateStudentAllDetailsRequestModel.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/update-student-all-details'), toFormData(updateStudentAllDetailsRequestModel), {headers : this.getHeaders("updateStudentAllDetails")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentAllDetails(updateStudentAllDetailsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateStudentFirstName(updateStudentFirstNameRequestModel: IUpdateStudentFirstNameRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/update-student-first-name'), updateStudentFirstNameRequestModel, {headers : this.getHeaders("updateStudentFirstName")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentFirstName(updateStudentFirstNameRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateStudentFirstName2(studentUUID : string, firstName : string, faculty1UUID: string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/update-student-first-name2'), toFormData({studentUUID, firstName, faculty1UUID, }), {headers : this.getHeaders("updateStudentFirstName2")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentFirstName2(studentUUID, firstName, faculty1UUID);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateSelectedEmployees(ids : Array<any>): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee/update-selected-employees'), toFormData({ids}), {headers : this.getHeaders("updateSelectedEmployees")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateSelectedEmployees(ids);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmployeeList(searchCriteria: retrieveEmployeeListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.joiningDateFrom != null) params = params.append("joiningDateFrom", searchCriteria.joiningDateFrom);
    if (searchCriteria.joiningDateTo != null) params = params.append("joiningDateTo", searchCriteria.joiningDateTo);
    if (searchCriteria.employeeUUID != null) params = params.append("employeeUUID", searchCriteria.employeeUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    params = params.append("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/employee/retrieve-employee-list'), { params: params, headers : this.getHeaders("retrieveEmployeeList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmployeeList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteStudentsByIds(ids : Array<any>): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/delete-students-by-ids'), toFormData({ids}), {headers : this.getHeaders("deleteStudentsByIds")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteStudentsByIds(ids);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateStudentByIds(updateStudentByIdsRequestModel: IUpdateStudentByIdsRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/update-student-by-ids'), updateStudentByIdsRequestModel, {headers : this.getHeaders("updateStudentByIds")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentByIds(updateStudentByIdsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveStudentList(searchCriteria: retrieveStudentListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.studentUUID != null) params = params.append("studentUUID", searchCriteria.studentUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    if (searchCriteria.classInfoUUID != null) params = params.append("classInfoUUID", searchCriteria.classInfoUUID);
    if (searchCriteria.sectionUUID != null) params = params.append("sectionUUID", searchCriteria.sectionUUID);
    if (searchCriteria.gender != null) params = params.append("gender", searchCriteria.gender);
    if (searchCriteria.isAccountActive != null) params = params.append("isAccountActive", searchCriteria.isAccountActive);
    if (searchCriteria.dateOfBirthFrom != null) params = params.append("dateOfBirthFrom", searchCriteria.dateOfBirthFrom);
    if (searchCriteria.dateOfBirthTo != null) params = params.append("dateOfBirthTo", searchCriteria.dateOfBirthTo);
    if (searchCriteria.dynamicLocationUUID != null) params = params.append("dynamicLocationUUID", searchCriteria.dynamicLocationUUID);
    if (searchCriteria.staticLocationUUID != null) params = params.append("staticLocationUUID", searchCriteria.staticLocationUUID);
    if (searchCriteria.location1UUID != null) params = params.append("location1UUID", searchCriteria.location1UUID);
    if (searchCriteria.age != null) params = params.append("age", searchCriteria.age);
    if (searchCriteria.percentage != null) params = params.append("percentage", searchCriteria.percentage);
    if (searchCriteria.collegeId != null) params = params.append("collegeId", searchCriteria.collegeId);
    if (searchCriteria.dateTimeField != null) params = params.append("dateTimeField", searchCriteria.dateTimeField);
    if (searchCriteria.dateTimeWithSecondsField != null) params = params.append("dateTimeWithSecondsField", searchCriteria.dateTimeWithSecondsField);
    if (searchCriteria.timeField != null) params = params.append("timeField", searchCriteria.timeField);
    if (searchCriteria.timeWithSecondsField != null) params = params.append("timeWithSecondsField", searchCriteria.timeWithSecondsField);
    if (searchCriteria.isPassed != null) params = params.append("isPassed", searchCriteria.isPassed);
    if (searchCriteria.passMarks != null) params = params.append("passMarks", searchCriteria.passMarks);
    if (searchCriteria.failMarks != null) params = params.append("failMarks", searchCriteria.failMarks);
    if (searchCriteria.grade != null) params = params.append("grade", searchCriteria.grade);
    if (searchCriteria.gradeAMarks != null) params = params.append("gradeAMarks", searchCriteria.gradeAMarks);
    if (searchCriteria.gradeBMarks != null) params = params.append("gradeBMarks", searchCriteria.gradeBMarks);
    if (searchCriteria.gradeCMarks != null) params = params.append("gradeCMarks", searchCriteria.gradeCMarks);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student/retrieve-list'), { params: params, headers : this.getHeaders("retrieveStudentList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async sendSmsToSelectedStudents(sendSmsToSelectedStudentsRequestModel: ISendSmsToSelectedStudentsRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/send-sms-to-selected-students'), sendSmsToSelectedStudentsRequestModel, {headers : this.getHeaders("sendSmsToSelectedStudents")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.sendSmsToSelectedStudents(sendSmsToSelectedStudentsRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async getApiCustomFormFieldList(searchCriteria: getApiCustomFormFieldListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.apiName != null) params = params.append("apiName", searchCriteria.apiName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/custom-form-field/get-api-custom-form-field-list'), { params: params, headers : this.getHeaders("getApiCustomFormFieldList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.getApiCustomFormFieldList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createCustomFormField(createCustomFormFieldRequestModel: ICreateCustomFormFieldRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/custom-form-field/create'), createCustomFormFieldRequestModel, {headers : this.getHeaders("createCustomFormField")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createCustomFormField(createCustomFormFieldRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateCustomFormField(updateCustomFormFieldRequestModel: IUpdateCustomFormFieldRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/custom-form-field/update'), updateCustomFormFieldRequestModel, {headers : this.getHeaders("updateCustomFormField")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateCustomFormField(updateCustomFormFieldRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async getStudentGraphData(searchCriteria: getStudentGraphDataSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.isPassed != null) params = params.append("isPassed", searchCriteria.isPassed);
    if (searchCriteria.passMarks != null) params = params.append("passMarks", searchCriteria.passMarks);
    if (searchCriteria.failMarks != null) params = params.append("failMarks", searchCriteria.failMarks);
    if (searchCriteria.grade != null) params = params.append("grade", searchCriteria.grade);
    if (searchCriteria.gradeAMarks != null) params = params.append("gradeAMarks", searchCriteria.gradeAMarks);
    if (searchCriteria.gradeBMarks != null) params = params.append("gradeBMarks", searchCriteria.gradeBMarks);
    if (searchCriteria.gradeCMarks != null) params = params.append("gradeCMarks", searchCriteria.gradeCMarks);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student/get-student-graph-data'), { params: params, headers : this.getHeaders("getStudentGraphData") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.getStudentGraphData(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async sendClientRequestToTestSerializableParams(empLocationUUID : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/emp-location/send-client-request-to-test-serializable-params'), toFormData({empLocationUUID}), {headers : this.getHeaders("sendClientRequestToTestSerializableParams")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.sendClientRequestToTestSerializableParams(empLocationUUID);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async createStudentForFlexfields(createStudentForFlexfieldsRequestModel: ICreateStudentForFlexfieldsRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/student/create-student-for-flexfields'), createStudentForFlexfieldsRequestModel, {headers : this.getHeaders("createStudentForFlexfields")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createStudentForFlexfields(createStudentForFlexfieldsRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmployeeForFlexfields(createEmployeeForFlexfieldsRequestModel: ICreateEmployeeForFlexfieldsRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/employee/create-employee-for-flexfields'), createEmployeeForFlexfieldsRequestModel, {headers : this.getHeaders("createEmployeeForFlexfields")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmployeeForFlexfields(createEmployeeForFlexfieldsRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async assignToFaculty(facultyUUID: string, studentUUID : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/assign-to-faculty'), toFormData({facultyUUID, studentUUID}), {headers : this.getHeaders("assignToFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.assignToFaculty(facultyUUID, studentUUID);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async removeFromFaculty(studentUUID : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/remove-from-faculty'), toFormData({studentUUID}), {headers : this.getHeaders("removeFromFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.removeFromFaculty(studentUUID);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveStudentListForFaculty(searchCriteria: retrieveStudentListForFacultySearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.facultyUUID != null) params = params.append("facultyUUID", searchCriteria.facultyUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student/retrieve-student-list-for-faculty'), { params: params, headers : this.getHeaders("retrieveStudentListForFaculty") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentListForFaculty(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStudentExamResultListForFaculty(searchCriteria: retrieveStudentExamResultListForFacultySearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.facultyUUID != null) params = params.append("facultyUUID", searchCriteria.facultyUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student-exam-result/retrieve-student-exam-result-list-for-faculty'), { params: params, headers : this.getHeaders("retrieveStudentExamResultListForFaculty") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentExamResultListForFaculty(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveFlexfieldContextSegmentsMap(searchCriteria: retrieveFlexfieldContextSegmentsMapSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/flexfield-segment/retrieve-flexfield-context-segments-map'), { params: params, headers : this.getHeaders("retrieveFlexfieldContextSegmentsMap") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexfieldContextSegmentsMap(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStudentListWithJoin(searchCriteria: retrieveStudentListWithJoinSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student/retrieve-student-list-with-join'), { params: params, headers : this.getHeaders("retrieveStudentListWithJoin") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentListWithJoin(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updatePasswordForFaculty(updatePasswordForFacultyRequestModel: IUpdatePasswordForFacultyRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update-password-for-faculty'), updatePasswordForFacultyRequestModel, {headers : this.getHeaders("updatePasswordForFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updatePasswordForFaculty(updatePasswordForFacultyRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmailIdForFaculty(facultyUUID : string, newEmail : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update-email-id-for-faculty'), toFormData({facultyUUID, newEmail}), {headers : this.getHeaders("updateEmailIdForFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmailIdForFaculty(facultyUUID, newEmail);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateContactNoForFaculty(facultyUUID : string, newContactNo : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update-contact-no-for-faculty'), toFormData({facultyUUID, newContactNo}), {headers : this.getHeaders("updateContactNoForFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateContactNoForFaculty(facultyUUID, newContactNo);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateProfileDetailsForFaculty(updateProfileDetailsForFacultyRequestModel: IUpdateProfileDetailsForFacultyRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update-profile-details-for-faculty'), updateProfileDetailsForFacultyRequestModel, {headers : this.getHeaders("updateProfileDetailsForFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateProfileDetailsForFaculty(updateProfileDetailsForFacultyRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async makeFeePayment(makeFeePaymentRequestModel: IMakeFeePaymentRequestModel): Promise<IMakeFeePaymentResponseModel> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IMakeFeePaymentResponseModel = <IMakeFeePaymentResponseModel>await this.http.post(this.getApiUrl('/student/make-fee-payment'), makeFeePaymentRequestModel, {headers : this.getHeaders("makeFeePayment")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.makeFeePayment(makeFeePaymentRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async createStudentFeePayment(createStudentFeePaymentRequestModel: ICreateStudentFeePaymentRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/student-fee-payment/create-student-fee-payment'), createStudentFeePaymentRequestModel, {headers : this.getHeaders("createStudentFeePayment")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createStudentFeePayment(createStudentFeePaymentRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateStudentFeePaymentStatus(updateStudentFeePaymentStatusRequestModel: IUpdateStudentFeePaymentStatusRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student-fee-payment/update-student-fee-payment-status'), updateStudentFeePaymentStatusRequestModel, {headers : this.getHeaders("updateStudentFeePaymentStatus")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentFeePaymentStatus(updateStudentFeePaymentStatusRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveMaleGenderStudents(searchCriteria: retrieveMaleGenderStudentsSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student/retrieve-male-gender-students'), { params: params, headers : this.getHeaders("retrieveMaleGenderStudents") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveMaleGenderStudents(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async correlateEmailNotificationTest(correlateEmailNotificationTestRequestModel: ICorrelateEmailNotificationTestRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/email-notification-test/correlate-email-notification-test'), correlateEmailNotificationTestRequestModel, {headers : this.getHeaders("correlateEmailNotificationTest")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.correlateEmailNotificationTest(correlateEmailNotificationTestRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async getUpdatedApiParameters(getUpdatedApiParametersRequestModel: IGetUpdatedApiParametersRequestModel): Promise<IGetUpdatedApiParametersResponseModel> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IGetUpdatedApiParametersResponseModel = <IGetUpdatedApiParametersResponseModel>await this.http.post(this.getApiUrl('/api-parameters/get-updated-api-parameters'), getUpdatedApiParametersRequestModel, {headers : this.getHeaders("getUpdatedApiParameters")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.getUpdatedApiParameters(getUpdatedApiParametersRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async createStudent(createStudentRequestModel: ICreateStudentRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/student/create'), toFormData(createStudentRequestModel), {headers : this.getHeaders("createStudent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createStudent(createStudentRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStudent(studentUUID : string): Promise<IRetrieveStudentDto>
  {
    const params = new HttpParams()
      .append('studentUUID', studentUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveStudentDto = <IRetrieveStudentDto>await this.http.get(this.getApiUrl('/student/retrieve'), { params: params, headers : this.getHeaders("retrieveStudent") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudent(studentUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createCostCenterLineItem(createCostCenterLineItemRequestModel: ICreateCostCenterLineItemRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/cost-center-line-item/create'), createCostCenterLineItemRequestModel, {headers : this.getHeaders("createCostCenterLineItem")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createCostCenterLineItem(createCostCenterLineItemRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveCostCenterLineItemList(searchCriteria: retrieveCostCenterLineItemListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.costCenterLineItemUUID != null) params = params.append("costCenterLineItemUUID", searchCriteria.costCenterLineItemUUID);
    if (searchCriteria.salesInvoiceUUID != null) params = params.append("salesInvoiceUUID", searchCriteria.salesInvoiceUUID);
    if (searchCriteria.costCenterName != null) params = params.append("costCenterName", searchCriteria.costCenterName);
    if (searchCriteria.employee1UUID != null) params = params.append("employee1UUID", searchCriteria.employee1UUID);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/cost-center-line-item/retrieve-list'), { params: params, headers : this.getHeaders("retrieveCostCenterLineItemList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCostCenterLineItemList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateCostCenterLineItem(updateCostCenterLineItemRequestModel: IUpdateCostCenterLineItemRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/cost-center-line-item/update'), updateCostCenterLineItemRequestModel, {headers : this.getHeaders("updateCostCenterLineItem")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateCostCenterLineItem(updateCostCenterLineItemRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveCostCenterLineItem(costCenterLineItemUUID : string): Promise<IRetrieveCostCenterLineItemDto>
  {
    const params = new HttpParams()
      .append('costCenterLineItemUUID', costCenterLineItemUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveCostCenterLineItemDto = <IRetrieveCostCenterLineItemDto>await this.http.get(this.getApiUrl('/cost-center-line-item/retrieve'), { params: params, headers : this.getHeaders("retrieveCostCenterLineItem") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCostCenterLineItem(costCenterLineItemUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmployeeSection(createEmployeeSectionRequestModel: ICreateEmployeeSectionRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/employee-section/create'), createEmployeeSectionRequestModel, {headers : this.getHeaders("createEmployeeSection")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmployeeSection(createEmployeeSectionRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveEmployeeSectionList(searchCriteria: retrieveEmployeeSectionListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.employeeSectionUUID != null) params = params.append("employeeSectionUUID", searchCriteria.employeeSectionUUID);
    if (searchCriteria.employeeUUID != null) params = params.append("employeeUUID", searchCriteria.employeeUUID);
    if (searchCriteria.sectionName != null) params = params.append("sectionName", searchCriteria.sectionName);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/employee-section/retrieve-list'), { params: params, headers : this.getHeaders("retrieveEmployeeSectionList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmployeeSectionList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateEmployeeSection(updateEmployeeSectionRequestModel: IUpdateEmployeeSectionRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee-section/update'), updateEmployeeSectionRequestModel, {headers : this.getHeaders("updateEmployeeSection")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployeeSection(updateEmployeeSectionRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmployeeSection(employeeSectionUUID : string): Promise<IRetrieveEmployeeSectionDto>
  {
    const params = new HttpParams()
      .append('employeeSectionUUID', employeeSectionUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveEmployeeSectionDto = <IRetrieveEmployeeSectionDto>await this.http.get(this.getApiUrl('/employee-section/retrieve'), { params: params, headers : this.getHeaders("retrieveEmployeeSection") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmployeeSection(employeeSectionUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveFacultyList(searchCriteria: retrieveFacultyListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.facultyUUID != null) params = params.append("facultyUUID", searchCriteria.facultyUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    if (searchCriteria.emailId != null) params = params.append("emailId", searchCriteria.emailId);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/faculty/retrieve-list'), { params: params, headers : this.getHeaders("retrieveFacultyList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFacultyList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateFacultyFirstName(facultyUUID : string, firstName : string): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update-faculty-first-name'), toFormData({facultyUUID, firstName}), {headers : this.getHeaders("updateFacultyFirstName")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateFacultyFirstName(facultyUUID, firstName);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateAgeAndGender(updateAgeAndGenderRequestModel: IUpdateAgeAndGenderRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/update-age-and-gender'), updateAgeAndGenderRequestModel, {headers : this.getHeaders("updateAgeAndGender")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateAgeAndGender(updateAgeAndGenderRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateEmployeeName(updateEmployeeNameRequestModel: IUpdateEmployeeNameRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee/update-employee-name'), updateEmployeeNameRequestModel, {headers : this.getHeaders("updateEmployeeName")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployeeName(updateEmployeeNameRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveUploadPersonList(searchCriteria: retrieveUploadPersonListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.uploadPersonUUID != null) params = params.append("uploadPersonUUID", searchCriteria.uploadPersonUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    if (searchCriteria.address != null) params = params.append("address", searchCriteria.address);
    if (searchCriteria.locationUUID != null) params = params.append("locationUUID", searchCriteria.locationUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/upload-person/retrieve-list'), { params: params, headers : this.getHeaders("retrieveUploadPersonList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveUploadPersonList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async getSellerDataForRegistration(sourceType : string, sourceUUID : string): Promise<IGetSellerDataForRegistrationDto>
  {
    const params = new HttpParams()
      .append('sourceType', sourceType || "") 
      .append('sourceUUID', sourceUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IGetSellerDataForRegistrationDto = <IGetSellerDataForRegistrationDto>await this.http.get(this.getApiUrl('/seller/get-seller-data-for-registration'), { params: params, headers : this.getHeaders("getSellerDataForRegistration") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.getSellerDataForRegistration(sourceType, sourceUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveParentList(searchCriteria: retrieveParentListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.parentUUID != null) params = params.append("parentUUID", searchCriteria.parentUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    if (searchCriteria.mobileNumber != null) params = params.append("mobileNumber", searchCriteria.mobileNumber);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/parent/retrieve-list'), { params: params, headers : this.getHeaders("retrieveParentList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveParentList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateParentsMobileNumber(updateParentsMobileNumberRequestModel: IUpdateParentsMobileNumberRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/parent/update-parents-mobile-number'), updateParentsMobileNumberRequestModel, {headers : this.getHeaders("updateParentsMobileNumber")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateParentsMobileNumber(updateParentsMobileNumberRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async updateUserInfo(updateUserInfoRequestModel: IUpdateUserInfoRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-info/update'), updateUserInfoRequestModel, {headers : this.getHeaders("updateUserInfo")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateUserInfo(updateUserInfoRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async createPrivilegeGroup(createPrivilegeGroupRequestModel: ICreatePrivilegeGroupRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/privilege-group/create'), createPrivilegeGroupRequestModel, {headers : this.getHeaders("createPrivilegeGroup")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createPrivilegeGroup(createPrivilegeGroupRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updatePrivilegeGroup(updatePrivilegeGroupRequestModel: IUpdatePrivilegeGroupRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/privilege-group/update'), updatePrivilegeGroupRequestModel, {headers : this.getHeaders("updatePrivilegeGroup")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updatePrivilegeGroup(updatePrivilegeGroupRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrievePrivilegeGroup(privilegeGroupUUID : string): Promise<IRetrievePrivilegeGroupDto>
  {
    const params = new HttpParams()
      .append('privilegeGroupUUID', privilegeGroupUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrievePrivilegeGroupDto = <IRetrievePrivilegeGroupDto>await this.http.get(this.getApiUrl('/privilege-group/retrieve'), { params: params, headers : this.getHeaders("retrievePrivilegeGroup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrievePrivilegeGroup(privilegeGroupUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrievePrivilegeGroupList(searchCriteria: retrievePrivilegeGroupListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.privilegeGroupUUID != null) params = params.append("privilegeGroupUUID", searchCriteria.privilegeGroupUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/privilege-group/retrieve-list'), { params: params, headers : this.getHeaders("retrievePrivilegeGroupList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrievePrivilegeGroupList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createUserRole(createUserRoleRequestModel: ICreateUserRoleRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/user-role/create'), createUserRoleRequestModel, {headers : this.getHeaders("createUserRole")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createUserRole(createUserRoleRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveUserRole(userRoleUUID : string): Promise<IRetrieveUserRoleDto>
  {
    const params = new HttpParams()
      .append('userRoleUUID', userRoleUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveUserRoleDto = <IRetrieveUserRoleDto>await this.http.get(this.getApiUrl('/user-role/retrieve'), { params: params, headers : this.getHeaders("retrieveUserRole") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveUserRole(userRoleUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveUserRoleList(searchCriteria: retrieveUserRoleListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.userRoleUUID != null) params = params.append("userRoleUUID", searchCriteria.userRoleUUID);
    if (searchCriteria.privilegeGroupUUID != null) params = params.append("privilegeGroupUUID", searchCriteria.privilegeGroupUUID);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    if (searchCriteria.userInfoUUID != null) params = params.append("userInfoUUID", searchCriteria.userInfoUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/user-role/retrieve-list'), { params: params, headers : this.getHeaders("retrieveUserRoleList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveUserRoleList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteUserRole(userRoleUUID:string): Promise<IResponseMessage> {
    try
    {
      if (!this.processApiRequest('Hrms')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/user-role/delete'), toFormData({userRoleUUID}), {headers : this.getHeaders("deleteUserRole")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteUserRole(userRoleUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmployee(createEmployeeRequestModel: ICreateEmployeeRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      createEmployeeRequestModel.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/employee/create'), toFormData(createEmployeeRequestModel), {headers : this.getHeaders("createEmployee")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmployee(createEmployeeRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateEmployee(updateEmployeeRequestModel: IUpdateEmployeeRequestModel): Promise<IResponseMessage> {
    try 
    {    
      updateEmployeeRequestModel.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee/update'), toFormData(updateEmployeeRequestModel), {headers : this.getHeaders("updateEmployee")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmployee(updateEmployeeRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmployee(employeeUUID : string): Promise<IRetrieveEmployeeDto>
  {
    const params = new HttpParams()
      .append('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone)
      .append('employeeUUID', employeeUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveEmployeeDto = <IRetrieveEmployeeDto>await this.http.get(this.getApiUrl('/employee/retrieve'), { params: params, headers : this.getHeaders("retrieveEmployee") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmployee(employeeUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteEmployee(employeeUUID:string): Promise<IResponseMessage> {
    try
    {
      if (!this.processApiRequest('Hrms')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee/delete'), toFormData({employeeUUID}), {headers : this.getHeaders("deleteEmployee")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteEmployee(employeeUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteEmployeeByIds(ids : Array<any>): Promise<IResponseMessage> {
    try 
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/employee/delete-by-ids'), toFormData({ids}), {headers : this.getHeaders("deleteEmployeeByIds")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteEmployeeByIds(ids);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmpLocation(createEmpLocationRequestModel: ICreateEmpLocationRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/emp-location/create'), createEmpLocationRequestModel, {headers : this.getHeaders("createEmpLocation")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmpLocation(createEmpLocationRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateEmpLocation(updateEmpLocationRequestModel: IUpdateEmpLocationRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/emp-location/update'), updateEmpLocationRequestModel, {headers : this.getHeaders("updateEmpLocation")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmpLocation(updateEmpLocationRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmpLocation(empLocationUUID : string): Promise<IRetrieveEmpLocationDto>
  {
    const params = new HttpParams()
      .append('empLocationUUID', empLocationUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveEmpLocationDto = <IRetrieveEmpLocationDto>await this.http.get(this.getApiUrl('/emp-location/retrieve'), { params: params, headers : this.getHeaders("retrieveEmpLocation") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmpLocation(empLocationUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveEmpLocationList(searchCriteria: retrieveEmpLocationListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.empLocationUUID != null) params = params.append("empLocationUUID", searchCriteria.empLocationUUID);
    if (searchCriteria.locationName != null) params = params.append("locationName", searchCriteria.locationName);
    if (searchCriteria.locationType != null) params = params.append("locationType", searchCriteria.locationType);
    if (searchCriteria.enableLocationNameUpdate != null) params = params.append("enableLocationNameUpdate", searchCriteria.enableLocationNameUpdate);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    if (searchCriteria.excludeColumnTest != null) params = params.append("excludeColumnTest", searchCriteria.excludeColumnTest);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/emp-location/retrieve-list'), { params: params, headers : this.getHeaders("retrieveEmpLocationList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmpLocationList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmpDependent(createEmpDependentRequestModel: ICreateEmpDependentRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/emp-dependent/create'), createEmpDependentRequestModel, {headers : this.getHeaders("createEmpDependent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmpDependent(createEmpDependentRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateEmpDependent(updateEmpDependentRequestModel: IUpdateEmpDependentRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/emp-dependent/update'), updateEmpDependentRequestModel, {headers : this.getHeaders("updateEmpDependent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmpDependent(updateEmpDependentRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmpDependent(empDependentUUID : string): Promise<IRetrieveEmpDependentDto>
  {
    const params = new HttpParams()
      .append('empDependentUUID', empDependentUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveEmpDependentDto = <IRetrieveEmpDependentDto>await this.http.get(this.getApiUrl('/emp-dependent/retrieve'), { params: params, headers : this.getHeaders("retrieveEmpDependent") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmpDependent(empDependentUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveEmpDependentList(searchCriteria: retrieveEmpDependentListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.empDependentUUID != null) params = params.append("empDependentUUID", searchCriteria.empDependentUUID);
    if (searchCriteria.employeeUUID != null) params = params.append("employeeUUID", searchCriteria.employeeUUID);
    if (searchCriteria.depEmpName != null) params = params.append("depEmpName", searchCriteria.depEmpName);
    if (searchCriteria.employeeSectionUUID != null) params = params.append("employeeSectionUUID", searchCriteria.employeeSectionUUID);
    if (searchCriteria.depEmpRelationship != null) params = params.append("depEmpRelationship", searchCriteria.depEmpRelationship);
    if (searchCriteria.isPassed != null) params = params.append("isPassed", searchCriteria.isPassed);
    if (searchCriteria.passMarks != null) params = params.append("passMarks", searchCriteria.passMarks);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/emp-dependent/retrieve-list'), { params: params, headers : this.getHeaders("retrieveEmpDependentList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmpDependentList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createTaxType(createTaxTypeRequestModel: ICreateTaxTypeRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/tax-type/create'), createTaxTypeRequestModel, {headers : this.getHeaders("createTaxType")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createTaxType(createTaxTypeRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateTaxType(updateTaxTypeRequestModel: IUpdateTaxTypeRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/tax-type/update'), updateTaxTypeRequestModel, {headers : this.getHeaders("updateTaxType")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateTaxType(updateTaxTypeRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveTaxType(taxTypeUUID : string): Promise<IRetrieveTaxTypeDto>
  {
    const params = new HttpParams()
      .append('taxTypeUUID', taxTypeUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveTaxTypeDto = <IRetrieveTaxTypeDto>await this.http.get(this.getApiUrl('/tax-type/retrieve'), { params: params, headers : this.getHeaders("retrieveTaxType") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveTaxType(taxTypeUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveTaxTypeList(searchCriteria: retrieveTaxTypeListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.taxTypeUUID != null) params = params.append("taxTypeUUID", searchCriteria.taxTypeUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/tax-type/retrieve-list'), { params: params, headers : this.getHeaders("retrieveTaxTypeList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveTaxTypeList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createTaxAccount(createTaxAccountRequestModel: ICreateTaxAccountRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/tax-account/create'), createTaxAccountRequestModel, {headers : this.getHeaders("createTaxAccount")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createTaxAccount(createTaxAccountRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateTaxAccount(updateTaxAccountRequestModel: IUpdateTaxAccountRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/tax-account/update'), updateTaxAccountRequestModel, {headers : this.getHeaders("updateTaxAccount")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateTaxAccount(updateTaxAccountRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveTaxAccount(taxAccountUUID : string): Promise<IRetrieveTaxAccountDto>
  {
    const params = new HttpParams()
      .append('taxAccountUUID', taxAccountUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveTaxAccountDto = <IRetrieveTaxAccountDto>await this.http.get(this.getApiUrl('/tax-account/retrieve'), { params: params, headers : this.getHeaders("retrieveTaxAccount") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveTaxAccount(taxAccountUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveTaxAccountList(searchCriteria: retrieveTaxAccountListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.taxAccountUUID != null) params = params.append("taxAccountUUID", searchCriteria.taxAccountUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.taxTypeUUID != null) params = params.append("taxTypeUUID", searchCriteria.taxTypeUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/tax-account/retrieve-list'), { params: params, headers : this.getHeaders("retrieveTaxAccountList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveTaxAccountList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createSalesInvoice2(createSalesInvoice2RequestModel: ICreateSalesInvoice2RequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/sales-invoice2/create'), createSalesInvoice2RequestModel, {headers : this.getHeaders("createSalesInvoice2")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createSalesInvoice2(createSalesInvoice2RequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateSalesInvoice2(updateSalesInvoice2RequestModel: IUpdateSalesInvoice2RequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/sales-invoice2/update'), updateSalesInvoice2RequestModel, {headers : this.getHeaders("updateSalesInvoice2")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateSalesInvoice2(updateSalesInvoice2RequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveSalesInvoice2(salesInvoice2UUID : string): Promise<IRetrieveSalesInvoice2Dto>
  {
    const params = new HttpParams()
      .append('salesInvoice2UUID', salesInvoice2UUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveSalesInvoice2Dto = <IRetrieveSalesInvoice2Dto>await this.http.get(this.getApiUrl('/sales-invoice2/retrieve'), { params: params, headers : this.getHeaders("retrieveSalesInvoice2") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSalesInvoice2(salesInvoice2UUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveSalesInvoice2List(searchCriteria: retrieveSalesInvoice2ListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.salesInvoice2UUID != null) params = params.append("salesInvoice2UUID", searchCriteria.salesInvoice2UUID);
    if (searchCriteria.invoiceNo != null) params = params.append("invoiceNo", searchCriteria.invoiceNo);
    if (searchCriteria.invoiceDate != null) params = params.append("invoiceDate", searchCriteria.invoiceDate);
    if (searchCriteria.paymentDate != null) params = params.append("paymentDate", searchCriteria.paymentDate);
    if (searchCriteria.paymentTime != null) params = params.append("paymentTime", searchCriteria.paymentTime);
    if (searchCriteria.buyerType != null) params = params.append("buyerType", searchCriteria.buyerType);
    if (searchCriteria.organisationUUID != null) params = params.append("organisationUUID", searchCriteria.organisationUUID);
    if (searchCriteria.personUUID != null) params = params.append("personUUID", searchCriteria.personUUID);
    if (searchCriteria.buyerUUID != null) params = params.append("buyerUUID", searchCriteria.buyerUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/sales-invoice2/retrieve-list'), { params: params, headers : this.getHeaders("retrieveSalesInvoice2List") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSalesInvoice2List(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createOrganisation(createOrganisationRequestModel: ICreateOrganisationRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/organisation/create'), createOrganisationRequestModel, {headers : this.getHeaders("createOrganisation")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createOrganisation(createOrganisationRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateOrganisation(updateOrganisationRequestModel: IUpdateOrganisationRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/organisation/update'), updateOrganisationRequestModel, {headers : this.getHeaders("updateOrganisation")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateOrganisation(updateOrganisationRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveOrganisation(organisationUUID : string): Promise<IRetrieveOrganisationDto>
  {
    const params = new HttpParams()
      .append('organisationUUID', organisationUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveOrganisationDto = <IRetrieveOrganisationDto>await this.http.get(this.getApiUrl('/organisation/retrieve'), { params: params, headers : this.getHeaders("retrieveOrganisation") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveOrganisation(organisationUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveOrganisationList(searchCriteria: retrieveOrganisationListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.organisationUUID != null) params = params.append("organisationUUID", searchCriteria.organisationUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.emailId != null) params = params.append("emailId", searchCriteria.emailId);
    if (searchCriteria.contactNo != null) params = params.append("contactNo", searchCriteria.contactNo);
    if (searchCriteria.isCommissionAgent != null) params = params.append("isCommissionAgent", searchCriteria.isCommissionAgent);
    if (searchCriteria.commissionAgentName != null) params = params.append("commissionAgentName", searchCriteria.commissionAgentName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/organisation/retrieve-list'), { params: params, headers : this.getHeaders("retrieveOrganisationList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveOrganisationList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createPerson(createPersonRequestModel: ICreatePersonRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/person/create'), createPersonRequestModel, {headers : this.getHeaders("createPerson")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createPerson(createPersonRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updatePerson(updatePersonRequestModel: IUpdatePersonRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/person/update'), updatePersonRequestModel, {headers : this.getHeaders("updatePerson")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updatePerson(updatePersonRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrievePerson(personUUID : string): Promise<IRetrievePersonDto>
  {
    const params = new HttpParams()
      .append('personUUID', personUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrievePersonDto = <IRetrievePersonDto>await this.http.get(this.getApiUrl('/person/retrieve'), { params: params, headers : this.getHeaders("retrievePerson") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrievePerson(personUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrievePersonList(searchCriteria: retrievePersonListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.personUUID != null) params = params.append("personUUID", searchCriteria.personUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.emailId != null) params = params.append("emailId", searchCriteria.emailId);
    if (searchCriteria.contactNo != null) params = params.append("contactNo", searchCriteria.contactNo);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/person/retrieve-list'), { params: params, headers : this.getHeaders("retrievePersonList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrievePersonList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createBuyer(createBuyerRequestModel: ICreateBuyerRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/buyer/create'), createBuyerRequestModel, {headers : this.getHeaders("createBuyer")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createBuyer(createBuyerRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateBuyer(updateBuyerRequestModel: IUpdateBuyerRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/buyer/update'), updateBuyerRequestModel, {headers : this.getHeaders("updateBuyer")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateBuyer(updateBuyerRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveBuyer(buyerUUID : string): Promise<IRetrieveBuyerDto>
  {
    const params = new HttpParams()
      .append('buyerUUID', buyerUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveBuyerDto = <IRetrieveBuyerDto>await this.http.get(this.getApiUrl('/buyer/retrieve'), { params: params, headers : this.getHeaders("retrieveBuyer") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveBuyer(buyerUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveBuyerList(searchCriteria: retrieveBuyerListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.buyerUUID != null) params = params.append("buyerUUID", searchCriteria.buyerUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/buyer/retrieve-list'), { params: params, headers : this.getHeaders("retrieveBuyerList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveBuyerList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createSeller(createSellerRequestModel: ICreateSellerRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/seller/create'), createSellerRequestModel, {headers : this.getHeaders("createSeller")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createSeller(createSellerRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateSeller(updateSellerRequestModel: IUpdateSellerRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/seller/update'), updateSellerRequestModel, {headers : this.getHeaders("updateSeller")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateSeller(updateSellerRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveSeller(sellerUUID : string): Promise<IRetrieveSellerDto>
  {
    const params = new HttpParams()
      .append('sellerUUID', sellerUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveSellerDto = <IRetrieveSellerDto>await this.http.get(this.getApiUrl('/seller/retrieve'), { params: params, headers : this.getHeaders("retrieveSeller") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSeller(sellerUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveSellerList(searchCriteria: retrieveSellerListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.sellerUUID != null) params = params.append("sellerUUID", searchCriteria.sellerUUID);
    if (searchCriteria.firstName != null) params = params.append("firstName", searchCriteria.firstName);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/seller/retrieve-list'), { params: params, headers : this.getHeaders("retrieveSellerList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSellerList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createSalesInvoice(createSalesInvoiceRequestModel: ICreateSalesInvoiceRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/sales-invoice/create'), createSalesInvoiceRequestModel, {headers : this.getHeaders("createSalesInvoice")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createSalesInvoice(createSalesInvoiceRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateSalesInvoice(updateSalesInvoiceRequestModel: IUpdateSalesInvoiceRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/sales-invoice/update'), updateSalesInvoiceRequestModel, {headers : this.getHeaders("updateSalesInvoice")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateSalesInvoice(updateSalesInvoiceRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveSalesInvoice(salesInvoiceUUID : string): Promise<IRetrieveSalesInvoiceDto>
  {
    const params = new HttpParams()
      .append('salesInvoiceUUID', salesInvoiceUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveSalesInvoiceDto = <IRetrieveSalesInvoiceDto>await this.http.get(this.getApiUrl('/sales-invoice/retrieve'), { params: params, headers : this.getHeaders("retrieveSalesInvoice") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSalesInvoice(salesInvoiceUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveSalesInvoiceList(searchCriteria: retrieveSalesInvoiceListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.salesInvoiceUUID != null) params = params.append("salesInvoiceUUID", searchCriteria.salesInvoiceUUID);
    if (searchCriteria.invoiceNo != null) params = params.append("invoiceNo", searchCriteria.invoiceNo);
    if (searchCriteria.location1UUID != null) params = params.append("location1UUID", searchCriteria.location1UUID);
    if (searchCriteria.invoiceDate != null) params = params.append("invoiceDate", searchCriteria.invoiceDate);
    if (searchCriteria.isPassed != null) params = params.append("isPassed", searchCriteria.isPassed);
    if (searchCriteria.passMarks != null) params = params.append("passMarks", searchCriteria.passMarks);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/sales-invoice/retrieve-list'), { params: params, headers : this.getHeaders("retrieveSalesInvoiceList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSalesInvoiceList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createInvoiceLineItem(createInvoiceLineItemRequestModel: ICreateInvoiceLineItemRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/invoice-line-item/create'), createInvoiceLineItemRequestModel, {headers : this.getHeaders("createInvoiceLineItem")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createInvoiceLineItem(createInvoiceLineItemRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateInvoiceLineItem(updateInvoiceLineItemRequestModel: IUpdateInvoiceLineItemRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/invoice-line-item/update'), updateInvoiceLineItemRequestModel, {headers : this.getHeaders("updateInvoiceLineItem")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateInvoiceLineItem(updateInvoiceLineItemRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveInvoiceLineItem(invoiceLineItemUUID : string): Promise<IRetrieveInvoiceLineItemDto>
  {
    const params = new HttpParams()
      .append('invoiceLineItemUUID', invoiceLineItemUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveInvoiceLineItemDto = <IRetrieveInvoiceLineItemDto>await this.http.get(this.getApiUrl('/invoice-line-item/retrieve'), { params: params, headers : this.getHeaders("retrieveInvoiceLineItem") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveInvoiceLineItem(invoiceLineItemUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveInvoiceLineItemList(searchCriteria: retrieveInvoiceLineItemListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.invoiceLineItemUUID != null) params = params.append("invoiceLineItemUUID", searchCriteria.invoiceLineItemUUID);
    if (searchCriteria.salesInvoiceUUID != null) params = params.append("salesInvoiceUUID", searchCriteria.salesInvoiceUUID);
    if (searchCriteria.lastName != null) params = params.append("lastName", searchCriteria.lastName);
    if (searchCriteria.gender != null) params = params.append("gender", searchCriteria.gender);
    if (searchCriteria.isAccountActive != null) params = params.append("isAccountActive", searchCriteria.isAccountActive);
    if (searchCriteria.dateOfBirth != null) params = params.append("dateOfBirth", searchCriteria.dateOfBirth);
    if (searchCriteria.dynamicLocationUUID != null) params = params.append("dynamicLocationUUID", searchCriteria.dynamicLocationUUID);
    if (searchCriteria.staticLocationUUID != null) params = params.append("staticLocationUUID", searchCriteria.staticLocationUUID);
    if (searchCriteria.age != null) params = params.append("age", searchCriteria.age);
    if (searchCriteria.percentage != null) params = params.append("percentage", searchCriteria.percentage);
    if (searchCriteria.collegeId != null) params = params.append("collegeId", searchCriteria.collegeId);
    if (searchCriteria.dateTimeField != null) params = params.append("dateTimeField", searchCriteria.dateTimeField);
    if (searchCriteria.dateTimeWithSecondsField != null) params = params.append("dateTimeWithSecondsField", searchCriteria.dateTimeWithSecondsField);
    if (searchCriteria.timeField != null) params = params.append("timeField", searchCriteria.timeField);
    if (searchCriteria.timeWithSecondsField != null) params = params.append("timeWithSecondsField", searchCriteria.timeWithSecondsField);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/invoice-line-item/retrieve-list'), { params: params, headers : this.getHeaders("retrieveInvoiceLineItemList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveInvoiceLineItemList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateStudent(updateStudentRequestModel: IUpdateStudentRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/update'), toFormData(updateStudentRequestModel), {headers : this.getHeaders("updateStudent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudent(updateStudentRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async deleteStudent(studentUUID:string): Promise<IResponseMessage> {
    try
    {
      if (!this.processApiRequest('Hrms')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student/delete'), toFormData({studentUUID}), {headers : this.getHeaders("deleteStudent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteStudent(studentUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createFaculty(createFacultyRequestModel: ICreateFacultyRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/faculty/create'), toFormData(createFacultyRequestModel), {headers : this.getHeaders("createFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createFaculty(createFacultyRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateFaculty(updateFacultyRequestModel: IUpdateFacultyRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update'), toFormData(updateFacultyRequestModel), {headers : this.getHeaders("updateFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateFaculty(updateFacultyRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveFaculty(facultyUUID : string): Promise<IRetrieveFacultyDto>
  {
    const params = new HttpParams()
      .append('facultyUUID', facultyUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveFacultyDto = <IRetrieveFacultyDto>await this.http.get(this.getApiUrl('/faculty/retrieve'), { params: params, headers : this.getHeaders("retrieveFaculty") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFaculty(facultyUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createStudentExamResult(createStudentExamResultRequestModel: ICreateStudentExamResultRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/student-exam-result/create'), createStudentExamResultRequestModel, {headers : this.getHeaders("createStudentExamResult")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createStudentExamResult(createStudentExamResultRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateStudentExamResult(updateStudentExamResultRequestModel: IUpdateStudentExamResultRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student-exam-result/update'), updateStudentExamResultRequestModel, {headers : this.getHeaders("updateStudentExamResult")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentExamResult(updateStudentExamResultRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveStudentExamResult(studentExamResultUUID : string): Promise<IRetrieveStudentExamResultDto>
  {
    const params = new HttpParams()
      .append('studentExamResultUUID', studentExamResultUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveStudentExamResultDto = <IRetrieveStudentExamResultDto>await this.http.get(this.getApiUrl('/student-exam-result/retrieve'), { params: params, headers : this.getHeaders("retrieveStudentExamResult") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentExamResult(studentExamResultUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStudentExamResultList(searchCriteria: retrieveStudentExamResultListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.studentExamResultUUID != null) params = params.append("studentExamResultUUID", searchCriteria.studentExamResultUUID);
    if (searchCriteria.studentUUID != null) params = params.append("studentUUID", searchCriteria.studentUUID);
    if (searchCriteria.examName != null) params = params.append("examName", searchCriteria.examName);
    if (searchCriteria.marks != null) params = params.append("marks", searchCriteria.marks);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student-exam-result/retrieve-list'), { params: params, headers : this.getHeaders("retrieveStudentExamResultList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentExamResultList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveCustomFormField(customFormFieldUUID : string): Promise<IRetrieveCustomFormFieldDto>
  {
    const params = new HttpParams()
      .append('customFormFieldUUID', customFormFieldUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveCustomFormFieldDto = <IRetrieveCustomFormFieldDto>await this.http.get(this.getApiUrl('/custom-form-field/retrieve'), { params: params, headers : this.getHeaders("retrieveCustomFormField") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCustomFormField(customFormFieldUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createFormFieldApi(createFormFieldApiRequestModel: ICreateFormFieldApiRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/form-field-api/create'), createFormFieldApiRequestModel, {headers : this.getHeaders("createFormFieldApi")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createFormFieldApi(createFormFieldApiRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateFormFieldApi(updateFormFieldApiRequestModel: IUpdateFormFieldApiRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/form-field-api/update'), updateFormFieldApiRequestModel, {headers : this.getHeaders("updateFormFieldApi")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateFormFieldApi(updateFormFieldApiRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveFormFieldApi(formFieldApiUUID : string): Promise<IRetrieveFormFieldApiDto>
  {
    const params = new HttpParams()
      .append('formFieldApiUUID', formFieldApiUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveFormFieldApiDto = <IRetrieveFormFieldApiDto>await this.http.get(this.getApiUrl('/form-field-api/retrieve'), { params: params, headers : this.getHeaders("retrieveFormFieldApi") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFormFieldApi(formFieldApiUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveFormFieldApiList(searchCriteria: retrieveFormFieldApiListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.formFieldApiUUID != null) params = params.append("formFieldApiUUID", searchCriteria.formFieldApiUUID);
    if (searchCriteria.customFormFieldUUID != null) params = params.append("customFormFieldUUID", searchCriteria.customFormFieldUUID);
    if (searchCriteria.apiName != null) params = params.append("apiName", searchCriteria.apiName);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/form-field-api/retrieve-list'), { params: params, headers : this.getHeaders("retrieveFormFieldApiList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFormFieldApiList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateFlexField(updateFlexFieldRequestModel: IUpdateFlexFieldRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/flex-field/update'), updateFlexFieldRequestModel, {headers : this.getHeaders("updateFlexField")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateFlexField(updateFlexFieldRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveFlexField(flexFieldUUID : string): Promise<IRetrieveFlexFieldDto>
  {
    const params = new HttpParams()
      .append('flexFieldUUID', flexFieldUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveFlexFieldDto = <IRetrieveFlexFieldDto>await this.http.get(this.getApiUrl('/flex-field/retrieve'), { params: params, headers : this.getHeaders("retrieveFlexField") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexField(flexFieldUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveFlexFieldList(searchCriteria: retrieveFlexFieldListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.flexFieldUUID != null) params = params.append("flexFieldUUID", searchCriteria.flexFieldUUID);
    if (searchCriteria.code != null) params = params.append("code", searchCriteria.code);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    if (searchCriteria.enableContext != null) params = params.append("enableContext", searchCriteria.enableContext);
    if (searchCriteria.globalSegmentsCount != null) params = params.append("globalSegmentsCount", searchCriteria.globalSegmentsCount);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/flex-field/retrieve-list'), { params: params, headers : this.getHeaders("retrieveFlexFieldList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexFieldList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createFlexfieldContextValue(createFlexfieldContextValueRequestModel: ICreateFlexfieldContextValueRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/flexfield-context-value/create'), createFlexfieldContextValueRequestModel, {headers : this.getHeaders("createFlexfieldContextValue")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createFlexfieldContextValue(createFlexfieldContextValueRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateFlexfieldContextValue(updateFlexfieldContextValueRequestModel: IUpdateFlexfieldContextValueRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/flexfield-context-value/update'), updateFlexfieldContextValueRequestModel, {headers : this.getHeaders("updateFlexfieldContextValue")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateFlexfieldContextValue(updateFlexfieldContextValueRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveFlexfieldContextValue(flexfieldContextValueUUID : string): Promise<IRetrieveFlexfieldContextValueDto>
  {
    const params = new HttpParams()
      .append('flexfieldContextValueUUID', flexfieldContextValueUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveFlexfieldContextValueDto = <IRetrieveFlexfieldContextValueDto>await this.http.get(this.getApiUrl('/flexfield-context-value/retrieve'), { params: params, headers : this.getHeaders("retrieveFlexfieldContextValue") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexfieldContextValue(flexfieldContextValueUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveFlexfieldContextValueList(searchCriteria: retrieveFlexfieldContextValueListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.flexfieldContextValueUUID != null) params = params.append("flexfieldContextValueUUID", searchCriteria.flexfieldContextValueUUID);
    if (searchCriteria.code != null) params = params.append("code", searchCriteria.code);
    if (searchCriteria.flexfieldUUID != null) params = params.append("flexfieldUUID", searchCriteria.flexfieldUUID);
    if (searchCriteria.displayValue != null) params = params.append("displayValue", searchCriteria.displayValue);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/flexfield-context-value/retrieve-list'), { params: params, headers : this.getHeaders("retrieveFlexfieldContextValueList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexfieldContextValueList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createFlexfieldSegment(createFlexfieldSegmentRequestModel: ICreateFlexfieldSegmentRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/flexfield-segment/create'), createFlexfieldSegmentRequestModel, {headers : this.getHeaders("createFlexfieldSegment")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createFlexfieldSegment(createFlexfieldSegmentRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateFlexfieldSegment(updateFlexfieldSegmentRequestModel: IUpdateFlexfieldSegmentRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/flexfield-segment/update'), updateFlexfieldSegmentRequestModel, {headers : this.getHeaders("updateFlexfieldSegment")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateFlexfieldSegment(updateFlexfieldSegmentRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveFlexfieldSegment(flexfieldSegmentUUID : string): Promise<IRetrieveFlexfieldSegmentDto>
  {
    const params = new HttpParams()
      .append('flexfieldSegmentUUID', flexfieldSegmentUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveFlexfieldSegmentDto = <IRetrieveFlexfieldSegmentDto>await this.http.get(this.getApiUrl('/flexfield-segment/retrieve'), { params: params, headers : this.getHeaders("retrieveFlexfieldSegment") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexfieldSegment(flexfieldSegmentUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveFlexfieldSegmentList(searchCriteria: retrieveFlexfieldSegmentListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.flexfieldSegmentUUID != null) params = params.append("flexfieldSegmentUUID", searchCriteria.flexfieldSegmentUUID);
    if (searchCriteria.flexfieldContextValueUUID != null) params = params.append("flexfieldContextValueUUID", searchCriteria.flexfieldContextValueUUID);
    if (searchCriteria.segmentName != null) params = params.append("segmentName", searchCriteria.segmentName);
    if (searchCriteria.segmentLabel != null) params = params.append("segmentLabel", searchCriteria.segmentLabel);
    if (searchCriteria.isGlobal != null) params = params.append("isGlobal", searchCriteria.isGlobal);
    if (searchCriteria.isMandatory != null) params = params.append("isMandatory", searchCriteria.isMandatory);
    if (searchCriteria.segmentOrder != null) params = params.append("segmentOrder", searchCriteria.segmentOrder);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/flexfield-segment/retrieve-list'), { params: params, headers : this.getHeaders("retrieveFlexfieldSegmentList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveFlexfieldSegmentList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createCountry(createCountryRequestModel: ICreateCountryRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/country/create'), createCountryRequestModel, {headers : this.getHeaders("createCountry")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createCountry(createCountryRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateCountry(updateCountryRequestModel: IUpdateCountryRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/country/update'), updateCountryRequestModel, {headers : this.getHeaders("updateCountry")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateCountry(updateCountryRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveCountry(countryUUID : string): Promise<IRetrieveCountryDto>
  {
    const params = new HttpParams()
      .append('countryUUID', countryUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveCountryDto = <IRetrieveCountryDto>await this.http.get(this.getApiUrl('/country/retrieve'), { params: params, headers : this.getHeaders("retrieveCountry") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCountry(countryUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveCountryList(searchCriteria: retrieveCountryListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.countryUUID != null) params = params.append("countryUUID", searchCriteria.countryUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/country/retrieve-list'), { params: params, headers : this.getHeaders("retrieveCountryList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCountryList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createState(createStateRequestModel: ICreateStateRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/state/create'), createStateRequestModel, {headers : this.getHeaders("createState")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createState(createStateRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateState(updateStateRequestModel: IUpdateStateRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/state/update'), updateStateRequestModel, {headers : this.getHeaders("updateState")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateState(updateStateRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveState(stateUUID : string): Promise<IRetrieveStateDto>
  {
    const params = new HttpParams()
      .append('stateUUID', stateUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveStateDto = <IRetrieveStateDto>await this.http.get(this.getApiUrl('/state/retrieve'), { params: params, headers : this.getHeaders("retrieveState") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveState(stateUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStateList(searchCriteria: retrieveStateListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.stateUUID != null) params = params.append("stateUUID", searchCriteria.stateUUID);
    if (searchCriteria.countryUUID != null) params = params.append("countryUUID", searchCriteria.countryUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/state/retrieve-list'), { params: params, headers : this.getHeaders("retrieveStateList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStateList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createAsset(createAssetRequestModel: ICreateAssetRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/asset/create'), createAssetRequestModel, {headers : this.getHeaders("createAsset")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createAsset(createAssetRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateAsset(updateAssetRequestModel: IUpdateAssetRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/asset/update'), updateAssetRequestModel, {headers : this.getHeaders("updateAsset")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateAsset(updateAssetRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveAsset(assetUUID : string): Promise<IRetrieveAssetDto>
  {
    const params = new HttpParams()
      .append('assetUUID', assetUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveAssetDto = <IRetrieveAssetDto>await this.http.get(this.getApiUrl('/asset/retrieve'), { params: params, headers : this.getHeaders("retrieveAsset") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveAsset(assetUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveAssetList(searchCriteria: retrieveAssetListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.assetUUID != null) params = params.append("assetUUID", searchCriteria.assetUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/asset/retrieve-list'), { params: params, headers : this.getHeaders("retrieveAssetList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveAssetList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createAssetComponent(createAssetComponentRequestModel: ICreateAssetComponentRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/asset-component/create'), createAssetComponentRequestModel, {headers : this.getHeaders("createAssetComponent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createAssetComponent(createAssetComponentRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateAssetComponent(updateAssetComponentRequestModel: IUpdateAssetComponentRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/asset-component/update'), updateAssetComponentRequestModel, {headers : this.getHeaders("updateAssetComponent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateAssetComponent(updateAssetComponentRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveAssetComponent(assetComponentUUID : string): Promise<IRetrieveAssetComponentDto>
  {
    const params = new HttpParams()
      .append('assetComponentUUID', assetComponentUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveAssetComponentDto = <IRetrieveAssetComponentDto>await this.http.get(this.getApiUrl('/asset-component/retrieve'), { params: params, headers : this.getHeaders("retrieveAssetComponent") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveAssetComponent(assetComponentUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveAssetComponentList(searchCriteria: retrieveAssetComponentListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.assetComponentUUID != null) params = params.append("assetComponentUUID", searchCriteria.assetComponentUUID);
    if (searchCriteria.assetUUID != null) params = params.append("assetUUID", searchCriteria.assetUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/asset-component/retrieve-list'), { params: params, headers : this.getHeaders("retrieveAssetComponentList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveAssetComponentList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createComponentSpare(createComponentSpareRequestModel: ICreateComponentSpareRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/component-spare/create'), createComponentSpareRequestModel, {headers : this.getHeaders("createComponentSpare")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createComponentSpare(createComponentSpareRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateComponentSpare(updateComponentSpareRequestModel: IUpdateComponentSpareRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/component-spare/update'), updateComponentSpareRequestModel, {headers : this.getHeaders("updateComponentSpare")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateComponentSpare(updateComponentSpareRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveComponentSpare(componentSpareUUID : string): Promise<IRetrieveComponentSpareDto>
  {
    const params = new HttpParams()
      .append('componentSpareUUID', componentSpareUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveComponentSpareDto = <IRetrieveComponentSpareDto>await this.http.get(this.getApiUrl('/component-spare/retrieve'), { params: params, headers : this.getHeaders("retrieveComponentSpare") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveComponentSpare(componentSpareUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveComponentSpareList(searchCriteria: retrieveComponentSpareListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.componentSpareUUID != null) params = params.append("componentSpareUUID", searchCriteria.componentSpareUUID);
    if (searchCriteria.assetComponentUUID != null) params = params.append("assetComponentUUID", searchCriteria.assetComponentUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/component-spare/retrieve-list'), { params: params, headers : this.getHeaders("retrieveComponentSpareList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveComponentSpareList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createClassInfo(createClassInfoRequestModel: ICreateClassInfoRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/class-info/create'), createClassInfoRequestModel, {headers : this.getHeaders("createClassInfo")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createClassInfo(createClassInfoRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveClassInfoList(searchCriteria: retrieveClassInfoListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.classInfoUUID != null) params = params.append("classInfoUUID", searchCriteria.classInfoUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/class-info/retrieve-list'), { params: params, headers : this.getHeaders("retrieveClassInfoList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveClassInfoList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createSection(createSectionRequestModel: ICreateSectionRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/section/create'), createSectionRequestModel, {headers : this.getHeaders("createSection")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createSection(createSectionRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateSection(updateSectionRequestModel: IUpdateSectionRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/section/update'), updateSectionRequestModel, {headers : this.getHeaders("updateSection")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateSection(updateSectionRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveSection(sectionUUID : string): Promise<IRetrieveSectionDto>
  {
    const params = new HttpParams()
      .append('sectionUUID', sectionUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveSectionDto = <IRetrieveSectionDto>await this.http.get(this.getApiUrl('/section/retrieve'), { params: params, headers : this.getHeaders("retrieveSection") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSection(sectionUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveSectionList(searchCriteria: retrieveSectionListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.sectionUUID != null) params = params.append("sectionUUID", searchCriteria.sectionUUID);
    if (searchCriteria.classInfoUUID != null) params = params.append("classInfoUUID", searchCriteria.classInfoUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.description != null) params = params.append("description", searchCriteria.description);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/section/retrieve-list'), { params: params, headers : this.getHeaders("retrieveSectionList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveSectionList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmailNotificationTest(createEmailNotificationTestRequestModel: ICreateEmailNotificationTestRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/email-notification-test/create'), createEmailNotificationTestRequestModel, {headers : this.getHeaders("createEmailNotificationTest")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmailNotificationTest(createEmailNotificationTestRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateEmailNotificationTest(updateEmailNotificationTestRequestModel: IUpdateEmailNotificationTestRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/email-notification-test/update'), updateEmailNotificationTestRequestModel, {headers : this.getHeaders("updateEmailNotificationTest")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateEmailNotificationTest(updateEmailNotificationTestRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveEmailNotificationTest(emailNotificationTestUUID : string): Promise<IRetrieveEmailNotificationTestDto>
  {
    const params = new HttpParams()
      .append('emailNotificationTestUUID', emailNotificationTestUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveEmailNotificationTestDto = <IRetrieveEmailNotificationTestDto>await this.http.get(this.getApiUrl('/email-notification-test/retrieve'), { params: params, headers : this.getHeaders("retrieveEmailNotificationTest") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmailNotificationTest(emailNotificationTestUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveEmailNotificationTestList(searchCriteria: retrieveEmailNotificationTestListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.emailNotificationTestUUID != null) params = params.append("emailNotificationTestUUID", searchCriteria.emailNotificationTestUUID);
    if (searchCriteria.subject != null) params = params.append("subject", searchCriteria.subject);
    if (searchCriteria.emailText != null) params = params.append("emailText", searchCriteria.emailText);
    if (searchCriteria.emailId != null) params = params.append("emailId", searchCriteria.emailId);
    if (searchCriteria.isEmailAddedToQueue != null) params = params.append("isEmailAddedToQueue", searchCriteria.isEmailAddedToQueue);
    if (searchCriteria.isEmailSent != null) params = params.append("isEmailSent", searchCriteria.isEmailSent);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/email-notification-test/retrieve-list'), { params: params, headers : this.getHeaders("retrieveEmailNotificationTestList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveEmailNotificationTestList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createParent(createParentRequestModel: ICreateParentRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/parent/create'), createParentRequestModel, {headers : this.getHeaders("createParent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createParent(createParentRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateParent(updateParentRequestModel: IUpdateParentRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/parent/update'), updateParentRequestModel, {headers : this.getHeaders("updateParent")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateParent(updateParentRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveParent(parentUUID : string): Promise<IRetrieveParentDto>
  {
    const params = new HttpParams()
      .append('parentUUID', parentUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveParentDto = <IRetrieveParentDto>await this.http.get(this.getApiUrl('/parent/retrieve'), { params: params, headers : this.getHeaders("retrieveParent") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveParent(parentUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createChild(createChildRequestModel: ICreateChildRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/child/create'), createChildRequestModel, {headers : this.getHeaders("createChild")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createChild(createChildRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateChild(updateChildRequestModel: IUpdateChildRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/child/update'), updateChildRequestModel, {headers : this.getHeaders("updateChild")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateChild(updateChildRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveChild(childUUID : string): Promise<IRetrieveChildDto>
  {
    const params = new HttpParams()
      .append('childUUID', childUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveChildDto = <IRetrieveChildDto>await this.http.get(this.getApiUrl('/child/retrieve'), { params: params, headers : this.getHeaders("retrieveChild") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveChild(childUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveChildList(searchCriteria: retrieveChildListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.childUUID != null) params = params.append("childUUID", searchCriteria.childUUID);
    if (searchCriteria.parentUUID != null) params = params.append("parentUUID", searchCriteria.parentUUID);
    if (searchCriteria.childFirstName != null) params = params.append("childFirstName", searchCriteria.childFirstName);
    if (searchCriteria.childLastName != null) params = params.append("childLastName", searchCriteria.childLastName);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/child/retrieve-list'), { params: params, headers : this.getHeaders("retrieveChildList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveChildList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createParentMobileNumber(createParentMobileNumberRequestModel: ICreateParentMobileNumberRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/parent-mobile-number/create'), createParentMobileNumberRequestModel, {headers : this.getHeaders("createParentMobileNumber")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createParentMobileNumber(createParentMobileNumberRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateParentMobileNumber(updateParentMobileNumberRequestModel: IUpdateParentMobileNumberRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/parent-mobile-number/update'), updateParentMobileNumberRequestModel, {headers : this.getHeaders("updateParentMobileNumber")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateParentMobileNumber(updateParentMobileNumberRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveParentMobileNumber(parentMobileNumberUUID : string): Promise<IRetrieveParentMobileNumberDto>
  {
    const params = new HttpParams()
      .append('parentMobileNumberUUID', parentMobileNumberUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveParentMobileNumberDto = <IRetrieveParentMobileNumberDto>await this.http.get(this.getApiUrl('/parent-mobile-number/retrieve'), { params: params, headers : this.getHeaders("retrieveParentMobileNumber") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveParentMobileNumber(parentMobileNumberUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveParentMobileNumberList(searchCriteria: retrieveParentMobileNumberListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.parentMobileNumberUUID != null) params = params.append("parentMobileNumberUUID", searchCriteria.parentMobileNumberUUID);
    if (searchCriteria.parentUUID != null) params = params.append("parentUUID", searchCriteria.parentUUID);
    if (searchCriteria.mobileNumber != null) params = params.append("mobileNumber", searchCriteria.mobileNumber);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/parent-mobile-number/retrieve-list'), { params: params, headers : this.getHeaders("retrieveParentMobileNumberList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveParentMobileNumberList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createEmployeeUpdate(createEmployeeUpdateRequestModel: ICreateEmployeeUpdateRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/employee-update/create'), createEmployeeUpdateRequestModel, {headers : this.getHeaders("createEmployeeUpdate")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createEmployeeUpdate(createEmployeeUpdateRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createUploadPerson(createUploadPersonRequestModel: ICreateUploadPersonRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/upload-person/create'), createUploadPersonRequestModel, {headers : this.getHeaders("createUploadPerson")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createUploadPerson(createUploadPersonRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateUploadPerson(updateUploadPersonRequestModel: IUpdateUploadPersonRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/upload-person/update'), updateUploadPersonRequestModel, {headers : this.getHeaders("updateUploadPerson")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateUploadPerson(updateUploadPersonRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveUploadPerson(uploadPersonUUID : string): Promise<IRetrieveUploadPersonDto>
  {
    const params = new HttpParams()
      .append('uploadPersonUUID', uploadPersonUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveUploadPersonDto = <IRetrieveUploadPersonDto>await this.http.get(this.getApiUrl('/upload-person/retrieve'), { params: params, headers : this.getHeaders("retrieveUploadPerson") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveUploadPerson(uploadPersonUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createStateForUpload(createStateForUploadRequestModel: ICreateStateForUploadRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/state-for-upload/create'), createStateForUploadRequestModel, {headers : this.getHeaders("createStateForUpload")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createStateForUpload(createStateForUploadRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateStateForUpload(updateStateForUploadRequestModel: IUpdateStateForUploadRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/state-for-upload/update'), updateStateForUploadRequestModel, {headers : this.getHeaders("updateStateForUpload")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStateForUpload(updateStateForUploadRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveStateForUpload(stateForUploadUUID : string): Promise<IRetrieveStateForUploadDto>
  {
    const params = new HttpParams()
      .append('stateForUploadUUID', stateForUploadUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveStateForUploadDto = <IRetrieveStateForUploadDto>await this.http.get(this.getApiUrl('/state-for-upload/retrieve'), { params: params, headers : this.getHeaders("retrieveStateForUpload") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStateForUpload(stateForUploadUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStateForUploadList(searchCriteria: retrieveStateForUploadListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.stateForUploadUUID != null) params = params.append("stateForUploadUUID", searchCriteria.stateForUploadUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.code != null) params = params.append("code", searchCriteria.code);
    if (searchCriteria.countryUUID != null) params = params.append("countryUUID", searchCriteria.countryUUID);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/state-for-upload/retrieve-list'), { params: params, headers : this.getHeaders("retrieveStateForUploadList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStateForUploadList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteStateForUpload(stateForUploadUUID:string): Promise<IResponseMessage> {
    try
    {
      if (!this.processApiRequest('Hrms')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/state-for-upload/delete'), toFormData({stateForUploadUUID}), {headers : this.getHeaders("deleteStateForUpload")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteStateForUpload(stateForUploadUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteStateForUploadByIds(ids : Array<any>): Promise<IResponseMessage> {
    try 
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/state-for-upload/delete-by-ids'), toFormData({ids}), {headers : this.getHeaders("deleteStateForUploadByIds")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteStateForUploadByIds(ids);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createCounryForUpload(createCounryForUploadRequestModel: ICreateCounryForUploadRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/counry-for-upload/create'), createCounryForUploadRequestModel, {headers : this.getHeaders("createCounryForUpload")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createCounryForUpload(createCounryForUploadRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateCounryForUpload(updateCounryForUploadRequestModel: IUpdateCounryForUploadRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/counry-for-upload/update'), updateCounryForUploadRequestModel, {headers : this.getHeaders("updateCounryForUpload")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateCounryForUpload(updateCounryForUploadRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveCounryForUpload(counryForUploadUUID : string): Promise<IRetrieveCounryForUploadDto>
  {
    const params = new HttpParams()
      .append('counryForUploadUUID', counryForUploadUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveCounryForUploadDto = <IRetrieveCounryForUploadDto>await this.http.get(this.getApiUrl('/counry-for-upload/retrieve'), { params: params, headers : this.getHeaders("retrieveCounryForUpload") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCounryForUpload(counryForUploadUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveCounryForUploadList(searchCriteria: retrieveCounryForUploadListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.counryForUploadUUID != null) params = params.append("counryForUploadUUID", searchCriteria.counryForUploadUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.code != null) params = params.append("code", searchCriteria.code);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/counry-for-upload/retrieve-list'), { params: params, headers : this.getHeaders("retrieveCounryForUploadList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveCounryForUploadList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteCounryForUpload(counryForUploadUUID:string): Promise<IResponseMessage> {
    try
    {
      if (!this.processApiRequest('Hrms')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/counry-for-upload/delete'), toFormData({counryForUploadUUID}), {headers : this.getHeaders("deleteCounryForUpload")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteCounryForUpload(counryForUploadUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async deleteCounryForUploadByIds(ids : Array<any>): Promise<IResponseMessage> {
    try 
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/counry-for-upload/delete-by-ids'), toFormData({ids}), {headers : this.getHeaders("deleteCounryForUploadByIds")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.deleteCounryForUploadByIds(ids);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async createStudentLeave(createStudentLeaveRequestModel: ICreateStudentLeaveRequestModel): Promise<CreateApiResponseModel> {
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: CreateApiResponseModel = <CreateApiResponseModel>await this.http.post(this.getApiUrl('/student-leave/create'), createStudentLeaveRequestModel, {headers : this.getHeaders("createStudentLeave")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.createStudentLeave(createStudentLeaveRequestModel);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateStudentLeave(updateStudentLeaveRequestModel: IUpdateStudentLeaveRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/student-leave/update'), updateStudentLeaveRequestModel, {headers : this.getHeaders("updateStudentLeave")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateStudentLeave(updateStudentLeaveRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
  async retrieveStudentLeave(studentLeaveUUID : string): Promise<IRetrieveStudentLeaveDto>
  {
    const params = new HttpParams()
      .append('studentLeaveUUID', studentLeaveUUID || "");

    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IRetrieveStudentLeaveDto = <IRetrieveStudentLeaveDto>await this.http.get(this.getApiUrl('/student-leave/retrieve'), { params: params, headers : this.getHeaders("retrieveStudentLeave") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentLeave(studentLeaveUUID);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async retrieveStudentLeaveList(searchCriteria: retrieveStudentLeaveListSearchFilter): Promise<RetrieveListResponseModel>
  {
    let params = new HttpParams();
    if (searchCriteria.pageNumber != null) params = params.append("pageNumber", searchCriteria.pageNumber);
    if (searchCriteria.pageSize != null) params = params.append("pageSize", searchCriteria.pageSize);
    if (searchCriteria.studentLeaveUUID != null) params = params.append("studentLeaveUUID", searchCriteria.studentLeaveUUID);
    if (searchCriteria.name != null) params = params.append("name", searchCriteria.name);
    if (searchCriteria.leaveDate != null) params = params.append("leaveDate", searchCriteria.leaveDate);
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student-leave/retrieve-list'), { params: params, headers : this.getHeaders("retrieveStudentLeaveList") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
         return this.retrieveStudentLeaveList(searchCriteria);
      }
      return response;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async updateSelfServiceAccessForFaculty(updateSelfServiceAccessForFacultyRequestModel: IUpdateSelfServiceAccessForFacultyRequestModel): Promise<IResponseMessage> {
    try 
    {    
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl('/faculty/update-self-service-access-for-faculty'), updateSelfServiceAccessForFacultyRequestModel, {headers : this.getHeaders("updateSelfServiceAccessForFaculty")}).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.updateSelfServiceAccessForFaculty(updateSelfServiceAccessForFacultyRequestModel);
      }
      return response;
    }
    catch (error) 
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }     
  }
   


  getAttachmentData(redirectUrl: string, attachmentUUID: string) : Observable<Blob>
  {
    try
    {
      const params = new HttpParams()
      .append('attachmentUUID', attachmentUUID || "");
      const response: any = this.http.get(this.getApiUrl(redirectUrl), { params: params, responseType: 'blob'});
      if(this.redirectApiToAnotherServer(response)) {
        return this.getAttachmentData(redirectUrl, attachmentUUID);
      }
      return response;
    }
    catch (error)
    {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
}
