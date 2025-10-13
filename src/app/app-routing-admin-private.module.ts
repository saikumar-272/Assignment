import { DynamicFieldDisplayComponent } from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ADMIN_PRIVATE_CHILDREN_ROUTES_BASE } from "./app-routing.admin-private-children-routes.base";
import { PrivilegeGroupItemsComponent } from "./private/authentication/privilege-group/privilege-group-items/privilege-group-items.component";
import {
  LoggedInUserOnlyGuard,
  StaffUserOnlyGuard,
} from "./shared/guards/user.guard";

const routes: Routes = [
  {
    path: "",
    children: [
      //Private custom routes
      {
        path: "privilege-group-items",
        component: PrivilegeGroupItemsComponent,
        canActivate: [StaffUserOnlyGuard, LoggedInUserOnlyGuard],
      },
      //Private base routes
      ...ADMIN_PRIVATE_CHILDREN_ROUTES_BASE],
  }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgbModule,
    AdminChildSectionFormComponent,
    DynamicFieldDisplayComponent,
    FormsModule],
  exports: [RouterModule],
})
export class AppRoutingAdminPrivateModule {}
