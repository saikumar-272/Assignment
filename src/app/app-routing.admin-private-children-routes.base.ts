import {Routes} from '@angular/router';
import {LoggedInUserOnlyGuard, StaffUserOnlyGuard} from './shared/guards/user.guard';
import {
    CreateNewStaffUserComponent
} from './private/template-app/admin/user-info/create-new-staff-user/create-new-staff-user.component';
import {
    RetrieveUserInfoComponent
} from './private/template-app/admin/user-info/retrieve-user-info/retrieve-user-info.component';
import {
    RetrieveUserInfoListComponent
} from './private/template-app/admin/user-info/retrieve-user-info-list/retrieve-user-info-list.component';
import {ViewProfileComponent} from './private/template-app/admin/user-profile/view-profile/view-profile.component';
import {
    RetrieveEmployeeBasicDetailsListComponent
} from './private/template-app/admin/employee-details-retrieve/retrieve-employee-basic-details-list/retrieve-employee-basic-details-list.component';
import {
    RetrieveEmployeeListComponent
} from './private/template-app/admin/employee/retrieve-employee-list/retrieve-employee-list.component';
import {
    RetrieveStudentListComponent
} from './private/template-app/admin/student/retrieve-student-list/retrieve-student-list.component';
import {
    GetApiCustomFormFieldListComponent
} from './private/template-app/admin/custom-form-field/get-api-custom-form-field-list/get-api-custom-form-field-list.component';
import {
    CreateCustomFormFieldComponent
} from './private/template-app/admin/custom-form-field/create-custom-form-field/create-custom-form-field.component';
import {
    UpdateCustomFormFieldComponent
} from './private/template-app/admin/custom-form-field/update-custom-form-field/update-custom-form-field.component';
import {
    GetStudentGraphDataComponent
} from './private/template-app/admin/student/get-student-graph-data/get-student-graph-data.component';
import {
    CreateStudentForFlexfieldsComponent
} from './private/template-app/admin/student/create-student-for-flexfields/create-student-for-flexfields.component';
import {
    CreateEmployeeForFlexfieldsComponent
} from './private/template-app/admin/employee/create-employee-for-flexfields/create-employee-for-flexfields.component';
import {
    RetrieveStudentListForFacultyComponent
} from './private/template-app/admin/student/retrieve-student-list-for-faculty/retrieve-student-list-for-faculty.component';
import {
    RetrieveStudentExamResultListForFacultyComponent
} from './private/template-app/admin/student-exam-result/retrieve-student-exam-result-list-for-faculty/retrieve-student-exam-result-list-for-faculty.component';
import {
    RetrieveStudentListWithJoinComponent
} from './private/template-app/admin/student/retrieve-student-list-with-join/retrieve-student-list-with-join.component';
import {
    RetrieveMaleGenderStudentsComponent
} from './private/template-app/admin/student/retrieve-male-gender-students/retrieve-male-gender-students.component';
import {CreateStudentComponent} from './private/template-app/admin/student/create-student/create-student.component';
import {
    RetrieveStudentComponent
} from './private/template-app/admin/student/retrieve-student/retrieve-student.component';
import {
    RetrieveFacultyListComponent
} from './private/template-app/admin/faculty/retrieve-faculty-list/retrieve-faculty-list.component';
import {
    RetrieveUploadPersonListComponent
} from './private/template-app/admin/upload-person/retrieve-upload-person-list/retrieve-upload-person-list.component';
import {
    RetrieveParentListComponent
} from './private/template-app/admin/parent/retrieve-parent-list/retrieve-parent-list.component';
import {
    UpdateUserInfoComponent
} from './private/template-app/admin/user-info/update-user-info/update-user-info.component';
import {
    CreatePrivilegeGroupComponent
} from './private/template-app/admin/privilege-group/create-privilege-group/create-privilege-group.component';
import {
    UpdatePrivilegeGroupComponent
} from './private/template-app/admin/privilege-group/update-privilege-group/update-privilege-group.component';
import {
    RetrievePrivilegeGroupComponent
} from './private/template-app/admin/privilege-group/retrieve-privilege-group/retrieve-privilege-group.component';
import {
    RetrievePrivilegeGroupListComponent
} from './private/template-app/admin/privilege-group/retrieve-privilege-group-list/retrieve-privilege-group-list.component';
import {
    CreateUserRoleComponent
} from './private/template-app/admin/user-role/create-user-role/create-user-role.component';
import {
    RetrieveUserRoleComponent
} from './private/template-app/admin/user-role/retrieve-user-role/retrieve-user-role.component';
import {
    RetrieveUserRoleListComponent
} from './private/template-app/admin/user-role/retrieve-user-role-list/retrieve-user-role-list.component';
import {CreateEmployeeComponent} from './private/template-app/admin/employee/create-employee/create-employee.component';
import {UpdateEmployeeComponent} from './private/template-app/admin/employee/update-employee/update-employee.component';
import {
    RetrieveEmployeeComponent
} from './private/template-app/admin/employee/retrieve-employee/retrieve-employee.component';
import {
    CreateEmpLocationComponent
} from './private/template-app/admin/emp-location/create-emp-location/create-emp-location.component';
import {
    UpdateEmpLocationComponent
} from './private/template-app/admin/emp-location/update-emp-location/update-emp-location.component';
import {
    RetrieveEmpLocationComponent
} from './private/template-app/admin/emp-location/retrieve-emp-location/retrieve-emp-location.component';
import {
    RetrieveEmpLocationListComponent
} from './private/template-app/admin/emp-location/retrieve-emp-location-list/retrieve-emp-location-list.component';
import {CreateTaxTypeComponent} from './private/template-app/admin/tax-type/create-tax-type/create-tax-type.component';
import {UpdateTaxTypeComponent} from './private/template-app/admin/tax-type/update-tax-type/update-tax-type.component';
import {
    RetrieveTaxTypeComponent
} from './private/template-app/admin/tax-type/retrieve-tax-type/retrieve-tax-type.component';
import {
    RetrieveTaxTypeListComponent
} from './private/template-app/admin/tax-type/retrieve-tax-type-list/retrieve-tax-type-list.component';
import {
    CreateTaxAccountComponent
} from './private/template-app/admin/tax-account/create-tax-account/create-tax-account.component';
import {
    UpdateTaxAccountComponent
} from './private/template-app/admin/tax-account/update-tax-account/update-tax-account.component';
import {
    RetrieveTaxAccountComponent
} from './private/template-app/admin/tax-account/retrieve-tax-account/retrieve-tax-account.component';
import {
    RetrieveTaxAccountListComponent
} from './private/template-app/admin/tax-account/retrieve-tax-account-list/retrieve-tax-account-list.component';
import {
    CreateSalesInvoice2Component
} from './private/template-app/admin/sales-invoice2/create-sales-invoice2/create-sales-invoice2.component';
import {
    UpdateSalesInvoice2Component
} from './private/template-app/admin/sales-invoice2/update-sales-invoice2/update-sales-invoice2.component';
import {
    RetrieveSalesInvoice2Component
} from './private/template-app/admin/sales-invoice2/retrieve-sales-invoice2/retrieve-sales-invoice2.component';
import {
    RetrieveSalesInvoice2ListComponent
} from './private/template-app/admin/sales-invoice2/retrieve-sales-invoice2-list/retrieve-sales-invoice2-list.component';
import {
    CreateOrganisationComponent
} from './private/template-app/admin/organisation/create-organisation/create-organisation.component';
import {
    UpdateOrganisationComponent
} from './private/template-app/admin/organisation/update-organisation/update-organisation.component';
import {
    RetrieveOrganisationComponent
} from './private/template-app/admin/organisation/retrieve-organisation/retrieve-organisation.component';
import {
    RetrieveOrganisationListComponent
} from './private/template-app/admin/organisation/retrieve-organisation-list/retrieve-organisation-list.component';
import {CreatePersonComponent} from './private/template-app/admin/person/create-person/create-person.component';
import {UpdatePersonComponent} from './private/template-app/admin/person/update-person/update-person.component';
import {RetrievePersonComponent} from './private/template-app/admin/person/retrieve-person/retrieve-person.component';
import {
    RetrievePersonListComponent
} from './private/template-app/admin/person/retrieve-person-list/retrieve-person-list.component';
import {CreateBuyerComponent} from './private/template-app/admin/buyer/create-buyer/create-buyer.component';
import {UpdateBuyerComponent} from './private/template-app/admin/buyer/update-buyer/update-buyer.component';
import {RetrieveBuyerComponent} from './private/template-app/admin/buyer/retrieve-buyer/retrieve-buyer.component';
import {
    RetrieveBuyerListComponent
} from './private/template-app/admin/buyer/retrieve-buyer-list/retrieve-buyer-list.component';
import {CreateSellerComponent} from './private/template-app/admin/seller/create-seller/create-seller.component';
import {UpdateSellerComponent} from './private/template-app/admin/seller/update-seller/update-seller.component';
import {RetrieveSellerComponent} from './private/template-app/admin/seller/retrieve-seller/retrieve-seller.component';
import {
    RetrieveSellerListComponent
} from './private/template-app/admin/seller/retrieve-seller-list/retrieve-seller-list.component';
import {
    CreateSalesInvoiceComponent
} from './private/template-app/admin/sales-invoice/create-sales-invoice/create-sales-invoice.component';
import {
    UpdateSalesInvoiceComponent
} from './private/template-app/admin/sales-invoice/update-sales-invoice/update-sales-invoice.component';
import {
    RetrieveSalesInvoiceComponent
} from './private/template-app/admin/sales-invoice/retrieve-sales-invoice/retrieve-sales-invoice.component';
import {
    RetrieveSalesInvoiceListComponent
} from './private/template-app/admin/sales-invoice/retrieve-sales-invoice-list/retrieve-sales-invoice-list.component';
import {UpdateStudentComponent} from './private/template-app/admin/student/update-student/update-student.component';
import {CreateFacultyComponent} from './private/template-app/admin/faculty/create-faculty/create-faculty.component';
import {UpdateFacultyComponent} from './private/template-app/admin/faculty/update-faculty/update-faculty.component';
import {
    RetrieveFacultyComponent
} from './private/template-app/admin/faculty/retrieve-faculty/retrieve-faculty.component';
import {
    CreateStudentExamResultComponent
} from './private/template-app/admin/student-exam-result/create-student-exam-result/create-student-exam-result.component';
import {
    UpdateStudentExamResultComponent
} from './private/template-app/admin/student-exam-result/update-student-exam-result/update-student-exam-result.component';
import {
    RetrieveStudentExamResultComponent
} from './private/template-app/admin/student-exam-result/retrieve-student-exam-result/retrieve-student-exam-result.component';
import {
    RetrieveStudentExamResultListComponent
} from './private/template-app/admin/student-exam-result/retrieve-student-exam-result-list/retrieve-student-exam-result-list.component';
import {
    RetrieveCustomFormFieldComponent
} from './private/template-app/admin/custom-form-field/retrieve-custom-form-field/retrieve-custom-form-field.component';
import {
    UpdateFlexFieldComponent
} from './private/template-app/admin/flex-field/update-flex-field/update-flex-field.component';
import {
    RetrieveFlexFieldComponent
} from './private/template-app/admin/flex-field/retrieve-flex-field/retrieve-flex-field.component';
import {
    RetrieveFlexFieldListComponent
} from './private/template-app/admin/flex-field/retrieve-flex-field-list/retrieve-flex-field-list.component';
import {
    CreateFlexfieldContextValueComponent
} from './private/template-app/admin/flexfield-context-value/create-flexfield-context-value/create-flexfield-context-value.component';
import {
    UpdateFlexfieldContextValueComponent
} from './private/template-app/admin/flexfield-context-value/update-flexfield-context-value/update-flexfield-context-value.component';
import {
    RetrieveFlexfieldContextValueComponent
} from './private/template-app/admin/flexfield-context-value/retrieve-flexfield-context-value/retrieve-flexfield-context-value.component';
import {
    RetrieveFlexfieldContextValueListComponent
} from './private/template-app/admin/flexfield-context-value/retrieve-flexfield-context-value-list/retrieve-flexfield-context-value-list.component';
import {CreateCountryComponent} from './private/template-app/admin/country/create-country/create-country.component';
import {UpdateCountryComponent} from './private/template-app/admin/country/update-country/update-country.component';
import {
    RetrieveCountryComponent
} from './private/template-app/admin/country/retrieve-country/retrieve-country.component';
import {
    RetrieveCountryListComponent
} from './private/template-app/admin/country/retrieve-country-list/retrieve-country-list.component';
import {CreateStateComponent} from './private/template-app/admin/state/create-state/create-state.component';
import {UpdateStateComponent} from './private/template-app/admin/state/update-state/update-state.component';
import {RetrieveStateComponent} from './private/template-app/admin/state/retrieve-state/retrieve-state.component';
import {
    RetrieveStateListComponent
} from './private/template-app/admin/state/retrieve-state-list/retrieve-state-list.component';
import {CreateAssetComponent} from './private/template-app/admin/asset/create-asset/create-asset.component';
import {UpdateAssetComponent} from './private/template-app/admin/asset/update-asset/update-asset.component';
import {RetrieveAssetComponent} from './private/template-app/admin/asset/retrieve-asset/retrieve-asset.component';
import {
    RetrieveAssetListComponent
} from './private/template-app/admin/asset/retrieve-asset-list/retrieve-asset-list.component';
import {
    CreateClassInfoComponent
} from './private/template-app/admin/class-info/create-class-info/create-class-info.component';
import {
    RetrieveClassInfoListComponent
} from './private/template-app/admin/class-info/retrieve-class-info-list/retrieve-class-info-list.component';
import {CreateSectionComponent} from './private/template-app/admin/section/create-section/create-section.component';
import {UpdateSectionComponent} from './private/template-app/admin/section/update-section/update-section.component';
import {
    RetrieveSectionComponent
} from './private/template-app/admin/section/retrieve-section/retrieve-section.component';
import {
    RetrieveSectionListComponent
} from './private/template-app/admin/section/retrieve-section-list/retrieve-section-list.component';
import {
    CreateEmailNotificationTestComponent
} from './private/template-app/admin/email-notification-test/create-email-notification-test/create-email-notification-test.component';
import {
    UpdateEmailNotificationTestComponent
} from './private/template-app/admin/email-notification-test/update-email-notification-test/update-email-notification-test.component';
import {
    RetrieveEmailNotificationTestComponent
} from './private/template-app/admin/email-notification-test/retrieve-email-notification-test/retrieve-email-notification-test.component';
import {
    RetrieveEmailNotificationTestListComponent
} from './private/template-app/admin/email-notification-test/retrieve-email-notification-test-list/retrieve-email-notification-test-list.component';
import {CreateParentComponent} from './private/template-app/admin/parent/create-parent/create-parent.component';
import {UpdateParentComponent} from './private/template-app/admin/parent/update-parent/update-parent.component';
import {RetrieveParentComponent} from './private/template-app/admin/parent/retrieve-parent/retrieve-parent.component';
import {
    CreateEmployeeUpdateComponent
} from './private/template-app/admin/employee-update/create-employee-update/create-employee-update.component';
import {
    CreateUploadPersonComponent
} from './private/template-app/admin/upload-person/create-upload-person/create-upload-person.component';
import {
    UpdateUploadPersonComponent
} from './private/template-app/admin/upload-person/update-upload-person/update-upload-person.component';
import {
    RetrieveUploadPersonComponent
} from './private/template-app/admin/upload-person/retrieve-upload-person/retrieve-upload-person.component';
import {
    CreateStateForUploadComponent
} from './private/template-app/admin/state-for-upload/create-state-for-upload/create-state-for-upload.component';
import {
    UpdateStateForUploadComponent
} from './private/template-app/admin/state-for-upload/update-state-for-upload/update-state-for-upload.component';
import {
    RetrieveStateForUploadComponent
} from './private/template-app/admin/state-for-upload/retrieve-state-for-upload/retrieve-state-for-upload.component';
import {
    RetrieveStateForUploadListComponent
} from './private/template-app/admin/state-for-upload/retrieve-state-for-upload-list/retrieve-state-for-upload-list.component';
import {
    CreateCounryForUploadComponent
} from './private/template-app/admin/counry-for-upload/create-counry-for-upload/create-counry-for-upload.component';
import {
    UpdateCounryForUploadComponent
} from './private/template-app/admin/counry-for-upload/update-counry-for-upload/update-counry-for-upload.component';
import {
    RetrieveCounryForUploadComponent
} from './private/template-app/admin/counry-for-upload/retrieve-counry-for-upload/retrieve-counry-for-upload.component';
import {
    RetrieveCounryForUploadListComponent
} from './private/template-app/admin/counry-for-upload/retrieve-counry-for-upload-list/retrieve-counry-for-upload-list.component';

import {AdminWelcomePageComponent} from './private/admin/welcome-page/admin-welcome-page.component';
import {InprogressAlertComponent} from './private/inprogress-alert/inprogress-alert.component';
import {ServiceDownAlertComponent} from './private/service-down-alert/service-down-alert.component';

export const ADMIN_PRIVATE_CHILDREN_ROUTES_BASE: Routes = [
    { path: 'intro-page', component: AdminWelcomePageComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'service-down-alert', component: ServiceDownAlertComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'inprogress-alert', component: InprogressAlertComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },

    { path: 'create-new-staff-user', component: CreateNewStaffUserComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-user-info', component: RetrieveUserInfoComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'user-info-list', component: RetrieveUserInfoListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'view-profile', component: ViewProfileComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-employee-basic-details-list', component: RetrieveEmployeeBasicDetailsListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'employee-list', component: RetrieveEmployeeListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'student-list', component: RetrieveStudentListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'get-api-custom-form-field-list', component: GetApiCustomFormFieldListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-custom-form-field', component: CreateCustomFormFieldComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-custom-form-field', component: UpdateCustomFormFieldComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'get-student-graph-data', component: GetStudentGraphDataComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-student-for-flexfields', component: CreateStudentForFlexfieldsComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-employee-for-flexfields', component: CreateEmployeeForFlexfieldsComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-student-list-for-faculty', component: RetrieveStudentListForFacultyComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-student-exam-result-list-for-faculty', component: RetrieveStudentExamResultListForFacultyComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-student-list-with-join', component: RetrieveStudentListWithJoinComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-male-gender-students', component: RetrieveMaleGenderStudentsComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-student', component: CreateStudentComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-student', component: RetrieveStudentComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'faculty-list', component: RetrieveFacultyListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'upload-person-list', component: RetrieveUploadPersonListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'parent-list', component: RetrieveParentListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-user-info', component: UpdateUserInfoComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-privilege-group', component: CreatePrivilegeGroupComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-privilege-group', component: UpdatePrivilegeGroupComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-privilege-group', component: RetrievePrivilegeGroupComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'privilege-group-list', component: RetrievePrivilegeGroupListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-user-role', component: CreateUserRoleComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-user-role', component: RetrieveUserRoleComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'user-role-list', component: RetrieveUserRoleListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-employee', component: CreateEmployeeComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-employee', component: UpdateEmployeeComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-employee', component: RetrieveEmployeeComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-emp-location', component: CreateEmpLocationComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-emp-location', component: UpdateEmpLocationComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-emp-location', component: RetrieveEmpLocationComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'emp-location-list', component: RetrieveEmpLocationListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-tax-type', component: CreateTaxTypeComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-tax-type', component: UpdateTaxTypeComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-tax-type', component: RetrieveTaxTypeComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'tax-type-list', component: RetrieveTaxTypeListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-tax-account', component: CreateTaxAccountComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-tax-account', component: UpdateTaxAccountComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-tax-account', component: RetrieveTaxAccountComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'tax-account-list', component: RetrieveTaxAccountListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-sales-invoice2', component: CreateSalesInvoice2Component, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-sales-invoice2', component: UpdateSalesInvoice2Component, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-sales-invoice2', component: RetrieveSalesInvoice2Component, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'sales-invoice2-list', component: RetrieveSalesInvoice2ListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-organisation', component: CreateOrganisationComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-organisation', component: UpdateOrganisationComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-organisation', component: RetrieveOrganisationComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'organisation-list', component: RetrieveOrganisationListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-person', component: CreatePersonComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-person', component: UpdatePersonComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-person', component: RetrievePersonComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'person-list', component: RetrievePersonListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-buyer', component: CreateBuyerComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-buyer', component: UpdateBuyerComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-buyer', component: RetrieveBuyerComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'buyer-list', component: RetrieveBuyerListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-seller', component: CreateSellerComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-seller', component: UpdateSellerComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-seller', component: RetrieveSellerComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'seller-list', component: RetrieveSellerListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-sales-invoice', component: CreateSalesInvoiceComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-sales-invoice', component: UpdateSalesInvoiceComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-sales-invoice', component: RetrieveSalesInvoiceComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'sales-invoice-list', component: RetrieveSalesInvoiceListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-student', component: UpdateStudentComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-faculty', component: CreateFacultyComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-faculty', component: UpdateFacultyComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-faculty', component: RetrieveFacultyComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-student-exam-result', component: CreateStudentExamResultComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-student-exam-result', component: UpdateStudentExamResultComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-student-exam-result', component: RetrieveStudentExamResultComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'student-exam-result-list', component: RetrieveStudentExamResultListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-custom-form-field', component: RetrieveCustomFormFieldComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-flex-field', component: UpdateFlexFieldComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-flex-field', component: RetrieveFlexFieldComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'flex-field-list', component: RetrieveFlexFieldListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-flexfield-context-value', component: CreateFlexfieldContextValueComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-flexfield-context-value', component: UpdateFlexfieldContextValueComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-flexfield-context-value', component: RetrieveFlexfieldContextValueComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'flexfield-context-value-list', component: RetrieveFlexfieldContextValueListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-country', component: CreateCountryComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-country', component: UpdateCountryComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-country', component: RetrieveCountryComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'country-list', component: RetrieveCountryListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-state', component: CreateStateComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-state', component: UpdateStateComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-state', component: RetrieveStateComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'state-list', component: RetrieveStateListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-asset', component: CreateAssetComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-asset', component: UpdateAssetComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-asset', component: RetrieveAssetComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'asset-list', component: RetrieveAssetListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-class-info', component: CreateClassInfoComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'class-info-list', component: RetrieveClassInfoListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-section', component: CreateSectionComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-section', component: UpdateSectionComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-section', component: RetrieveSectionComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'section-list', component: RetrieveSectionListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-email-notification-test', component: CreateEmailNotificationTestComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-email-notification-test', component: UpdateEmailNotificationTestComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-email-notification-test', component: RetrieveEmailNotificationTestComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'email-notification-test-list', component: RetrieveEmailNotificationTestListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-parent', component: CreateParentComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-parent', component: UpdateParentComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-parent', component: RetrieveParentComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-employee-update', component: CreateEmployeeUpdateComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-upload-person', component: CreateUploadPersonComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-upload-person', component: UpdateUploadPersonComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-upload-person', component: RetrieveUploadPersonComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-state-for-upload', component: CreateStateForUploadComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-state-for-upload', component: UpdateStateForUploadComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-state-for-upload', component: RetrieveStateForUploadComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'state-for-upload-list', component: RetrieveStateForUploadListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'create-counry-for-upload', component: CreateCounryForUploadComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-counry-for-upload', component: UpdateCounryForUploadComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-counry-for-upload', component: RetrieveCounryForUploadComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'counry-for-upload-list', component: RetrieveCounryForUploadListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
  ]

export class AppRoutingAdminPrivateChildrenRoutesBase { }
