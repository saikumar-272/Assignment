import {Routes} from '@angular/router';
import {LoggedInUserOnlyGuard, StaffUserOnlyGuard} from './shared/guards/user.guard';
import {
    CreateStudentLeaveComponent
} from './private/template-app/parent/student-leave/create-student-leave/create-student-leave.component';
import {
    UpdateStudentLeaveComponent
} from './private/template-app/parent/student-leave/update-student-leave/update-student-leave.component';
import {
    RetrieveStudentLeaveComponent
} from './private/template-app/parent/student-leave/retrieve-student-leave/retrieve-student-leave.component';
import {
    RetrieveStudentLeaveListComponent
} from './private/template-app/parent/student-leave/retrieve-student-leave-list/retrieve-student-leave-list.component';

import {ParentWelcomePageComponent} from './private/parent/welcome-page/parent-welcome-page.component';
import {InprogressAlertComponent} from './private/inprogress-alert/inprogress-alert.component';
import {ServiceDownAlertComponent} from './private/service-down-alert/service-down-alert.component';

export const PARENT_PRIVATE_CHILDREN_ROUTES_BASE: Routes = [
    { path: 'intro-page', component: ParentWelcomePageComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'service-down-alert', component: ServiceDownAlertComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'inprogress-alert', component: InprogressAlertComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },

    { path: 'create-student-leave', component: CreateStudentLeaveComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'update-student-leave', component: UpdateStudentLeaveComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'retrieve-student-leave', component: RetrieveStudentLeaveComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
    { path: 'student-leave-list', component: RetrieveStudentLeaveListComponent, canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard] },
  ]

export class AppRoutingParentPrivateChildrenRoutesBase { }
