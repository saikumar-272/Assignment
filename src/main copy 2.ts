import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { APP_INITIALIZER, importProvidersFrom } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgChartsModule } from "ng2-charts";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { AppComponent } from "./app/app.component";
import { appRoutes } from "./app/app-routing.module";
import { AuthenticationService } from "./app/shared/services/authentication.service";
import { BackendService } from "./app/shared/services/backend.service";
import { CustomisationService } from "./app/customisation.service";
import { BackendServiceTemplateApp } from "./app/shared/services/backend.service.template-app";
import { DomainService } from "./app/shared/services/domain.service";
import { TimeZoneService } from "./app/shared/services/timeZone.service";
import { ConfigPropertiesService } from "./app/shared/services/config-properties.service";
import { ToastNotificationService } from "./app/toast-notification-service";
import { httpInterceptorProviders } from "./app/shared/http-interceptors";
import { AuthInterceptor } from "./app/shared/http-interceptors/auth-interceptor";
import { LoggedInUserOnlyGuard } from "./app/shared/guards/user.guard";
import { DatePipe } from "@angular/common";
import { CustomDateParserFormatter } from "./app/shared/util/date-util";
import { initializeSessionFactory } from "./app/shared/app-initializer/session-initializer";

export function initApp(sessionFactory: any) {
  return () => initializeSessionFactory(sessionFactory);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),

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
      ReactiveFormsModule,
      FormlyModule.forRoot(),
      FormlyBootstrapModule
    ),

    // ✅ Add APP_INITIALIZER if still needed
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthenticationService],
      multi: true,
    },

    // ✅ Custom Date Formatter if still used
    {
      provide: NgbDateParserFormatter,
      useClass: CustomDateParserFormatter,
    },

    // ✅ Other providers
    httpInterceptorProviders,
    DatePipe,
    AuthenticationService,
    BackendService,
    BackendServiceTemplateApp,
    CustomisationService,
    DomainService,
    TimeZoneService,
    ConfigPropertiesService,
    ToastNotificationService,
    LoggedInUserOnlyGuard,
  ],
}).catch((err) => console.error(err));
