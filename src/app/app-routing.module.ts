import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./public/login/login.component";
import { ForgotPasswordComponent } from "./public/forgot-password/forgot-password.component";
import {
  LoggedInUserOnlyGuard,
  LoggedOutUserOnlyGuard,
} from "./shared/guards/user.guard";

import { RoutingManagementComponent } from "./manage-routing/routing-management.component";
import { ServiceRedirectionComponent } from "./private/service-redirection/service-redirection.component";
import { PublicComponent } from "./public/public.component";
import { PrintComponent } from "./private/print-landing/print.component";
import { AdminUserLandingComponent } from "./private/admin/user-landing/admin-user-landing.component";
import { ParentUserLandingComponent } from "./private/parent/user-landing/parent-user-landing.component";

export const SERVICE_CONTEXT_PATHS = [
  "templateapp",
  "tempappdummy",
  "testservice2",
  "testschoolbe",
  "mockservice1",
  "mockservice2"];
const serviceContextPathRoutes: Routes = SERVICE_CONTEXT_PATHS.map((path) => ({
  path,
  component: ServiceRedirectionComponent,
  children: [{ path: "**", component: ServiceRedirectionComponent }],
}));

export const appRoutes: Routes = [
  ...serviceContextPathRoutes,
  { path: "", component: RoutingManagementComponent },
  //Prints
  {
    path: "print",
    component: PrintComponent,
    canActivate: [LoggedInUserOnlyGuard],
    children: [
      // Lazy-loaded nested private routes for Admin
      {
        path: "",
        loadChildren: () =>
          import("./app-routing-print-private.module").then(
            (m) => m.AppRoutingPrintPrivateModule
          ),
      }],
  },

  // Routes accessible after login
  {
    path: "in",
    component: AdminUserLandingComponent,
    canActivate: [LoggedInUserOnlyGuard],
    children: [
      // Lazy-loaded nested private routes for Admin
      {
        path: "",
        loadChildren: () =>
          import("./app-routing-admin-private.module").then(
            (m) => m.AppRoutingAdminPrivateModule
          ),
      }],
  },
  // Routes accessible after login
  {
    path: "parent",
    component: ParentUserLandingComponent,
    canActivate: [LoggedInUserOnlyGuard],
    children: [
      // Lazy-loaded nested private routes for Parent
      {
        path: "",
        loadChildren: () =>
          import("./app-routing-parent-private.module").then(
            (m) => m.AppRoutingParentPrivateModule
          ),
      }],
  },
  {
    path: "public",
    component: PublicComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      {
        path: "login",
        component: LoginComponent,
        canActivate: [LoggedOutUserOnlyGuard],
      },
      { path: "forgot-password", component: ForgotPasswordComponent },
      {
        path: "",
        loadChildren: () =>
          import("./app-routing-custom-public.module").then(
            (m) => m.AppRoutingCustomPublicModule
          ),
      }],
  },
  { path: "**", redirectTo: "in" }, //If no match found
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
