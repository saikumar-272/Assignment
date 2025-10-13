import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {Constants} from "../util/constants";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {isBlank} from "../util/string-util";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token: string | null = this.authService.authToken;
    let authenticatedReq = req;
    if (token !== null) {
      authenticatedReq = req.clone({
        headers: req.headers.set(Constants.AUTH_TOKEN_HEADER_NAME, token)
      });
    }
    return next.handle(authenticatedReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Handle the response here if needed
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let customError = error.error;
        if (error.status === 0) {
          customError.alert = "Backend server is down!"
          customError.success = 0;
          if(isBlank(customError.errorCode)){
            customError.errorCode = Constants.ERROR_CODE_SERVICE_DOWN;
          }
        }
        return throwError({error:customError});
      })
    );
  }
}
