import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./auth-interceptor";
import {XhrInterceptor} from "./xhr-interceptor";

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders:Array<any> = [
  { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
