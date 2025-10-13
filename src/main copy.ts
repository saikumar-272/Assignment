import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { importProvidersFrom } from "@angular/core";

// Angular modules (for directives/components still using NgModule)
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgChartsModule } from "ng2-charts";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Root Component & Routes
import { AppComponent } from "./app/app.component";
import { appRoutes } from "./app/app-routing.module";

// Services
import { AuthenticationService } from "./app/shared/services/authentication.service";
import { BackendService } from "./app/shared/services/backend.service";
import { DomainService } from "./app/shared/services/domain.service";
import { ToastNotificationService } from "./app/toast-notification-service";
import { BackendServiceTemplateApp } from "./app/shared/services/backend.service.template-app";
import { CustomisationService } from "./app/customisation.service";

// Guards
import { LoggedInUserOnlyGuard } from "./app/shared/guards/user.guard";

// Interceptors
import { httpInterceptorProviders } from "./app/shared/http-interceptors";
import { AuthInterceptor } from "./app/shared/http-interceptors/auth-interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),

    provideHttpClient(withInterceptorsFromDi()), // ✅ enables DI interceptors

    // ✅ register AuthInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimations(),
    provideToastr({
      positionClass: "toast-top-right",
      preventDuplicates: true,
      timeOut: 3000,
    }),
    importProvidersFrom(
      NgbModule,
      NgSelectModule,
      NgChartsModule,
      AngularEditorModule,
      FormsModule,
      ReactiveFormsModule
    ),
    httpInterceptorProviders,
    AuthenticationService,
    BackendService,
    BackendServiceTemplateApp,
    DomainService,
    CustomisationService,
    ToastNotificationService,
    LoggedInUserOnlyGuard,
  ],
}).catch((err) => console.error(err));
