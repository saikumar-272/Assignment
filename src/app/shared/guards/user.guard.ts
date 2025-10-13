import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ILoggedInUserDetails} from '../interfaces/dto/auth-service/auth';
import {AuthenticationService} from '../services/authentication.service';
import {Constants} from '../util/constants';
import {isBlank} from '../util/string-util';
import {DomainService} from '../services/domain.service';

@Injectable({
  providedIn: 'root'
})
export class StaffUserOnlyGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
    private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {    
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserOnlyGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
    private router: Router, private route: ActivatedRoute, private domainService: DomainService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser: ILoggedInUserDetails | null = this.authService.currentUser;
    let errorCode = localStorage.getItem(Constants.ERROR_CODE);
    if (currentUser !== null) {
      if (!isBlank(errorCode) && errorCode == Constants.ERROR_CODE_UPGRADE_IN_PROGRESS) {
        if (state.url.split('?')[0] != "/in/inprogress-alert") {
          this.router.navigate(['/in/inprogress-alert'], { queryParams: { returnUrl: state.url } });
        }
      }
      else if (!isBlank(errorCode) && errorCode == Constants.ERROR_CODE_SERVICE_DOWN) {
        if (state.url.split('?')[0] != "/in/service-down-alert") {
          this.router.navigate(['/in/service-down-alert'], { queryParams: { returnUrl: state.url } });
        }
      }
      else if (!isBlank(errorCode) && (errorCode == Constants.ERROR_CODE_USE_NEW_VERSION
        || (errorCode == Constants.ERROR_CODE_TRANSITION_TO_STABLE_SERVER && this.domainService.redirectToNewDomain()))) {
        let frontendDomain = localStorage.getItem(Constants.NEW_FRONTEND_DOMAIN);
        let redirectRoute = this.route.snapshot.queryParams['returnUrl'] || '/in';
        if (frontendDomain && redirectRoute) {
          window.location.href = this.getUpdatedRedirectUrl(frontendDomain+redirectRoute);
          return false;
        }
      }
      else if (state.url.split('?')[0] == "/in/service-down-alert") {
          this.router.navigate(['/in']);
      }
      return true;
    }
    else {
      if (!isBlank(errorCode) && errorCode == Constants.ERROR_CODE_SERVICE_DOWN) {
        if (state.url.split('?')[0] != "/in/service-down-alert") {
          this.router.navigate(['/in/service-down-alert'], { queryParams: { returnUrl: state.url } });
        }
        return true;
      }
      this.router.navigate(['/public/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  getUpdatedRedirectUrl(url: string): string {
    let persistedSessionId: string | null = localStorage.getItem(Constants.AUTH_SESSION_STORAGE_KEY);
    let backendDomainPrefix: string | null = localStorage.getItem(Constants.BACKEND_DOMAIN_PREFIX);
    if (!isBlank(backendDomainPrefix) && backendDomainPrefix != null) {
      backendDomainPrefix = backendDomainPrefix.trim();
    }
    else {
      backendDomainPrefix = "";
    }
    const updatedRedirectRoute = this.addQueryParams(url, {
      sessionId: persistedSessionId,
      backendPrefix: backendDomainPrefix
    })
    return updatedRedirectRoute;
  }

  addQueryParams(url: string, params: { [key: string]: string | null }) {
    const urlObj = new URL(url);
    Object.keys(params).forEach(key => {
      if (params[key] !== null) {
        urlObj.searchParams.set(key, params[key] as string);
      }
    });
    return urlObj.toString();
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggedOutUserOnlyGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
    private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser: ILoggedInUserDetails | null = this.authService.currentUser;
    if (currentUser == null) {
      return true;
    }
    else {
      this.router.navigateByUrl('/in');
      return false;
    }
  }
}
