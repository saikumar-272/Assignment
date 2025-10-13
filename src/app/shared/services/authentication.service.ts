import { EventEmitter, Injectable, Output } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import {
  IAuthCredentials,
  IAuthenticationResponse,
  ILoggedInUserDetails,
} from "../interfaces/dto/auth-service/auth";
import { toFormData } from "../util/http-util";
import { Constants } from "../util/constants";
import {
  IGetPrivilegesListForLoggedInUserResponseModel,
  IResponseMessage,
} from "../interfaces/dto/dto-base";
import { BackendService } from "./backend.service";

import { isBlank } from "../util/string-util";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private sessionToken: string | null = null;
  private currentUserDetails: ILoggedInUserDetails | null = null;
  public userPrivilegeList = new Set();
  public get currentUser(): ILoggedInUserDetails | null {
    return this.currentUserDetails;
  }

  @Output() UserLoginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private backendService: BackendService
  ) {}

  get authToken() {
    return this.sessionToken;
  }

  async authenticateUser(
    credentials: IAuthCredentials
  ): Promise<IAuthenticationResponse | IResponseMessage> {
    try {
      localStorage.clear();
      const response: HttpResponse<IAuthenticationResponse> = <
        HttpResponse<IAuthenticationResponse>
      >await this.http
        .post(
          this.backendService.getApiUrl("/authenticateUser"),
          toFormData(credentials),
          { observe: "response" }
        )
        .toPromise();
      const authResponse: IAuthenticationResponse = { ...response.body! };
      if (authResponse.success == Constants.API_RESPONSE_TYPE_SUCCESS) {
        const xAuthTokenHeader = response.headers.get(
          Constants.AUTH_TOKEN_HEADER_NAME
        );
        if (!isBlank(authResponse.frontEndDomain)) {
          window.location.href = this.addQueryParams(
            authResponse.frontEndDomain + "/public/login-redirect",
            { id: xAuthTokenHeader }
          );
        }
        localStorage.setItem(
          Constants.BACKEND_DOMAIN_PREFIX,
          authResponse.backendDomainPrefix
        );
        // store the auth token received from backend
        this.persistSessionId(xAuthTokenHeader);
        // get the user details
        await this.loadLoggedInUserDetails();
        //Get logged in user privileges
        await this.loadLoggedInUserPrivileges();

        this.UserLoginEvent.emit(true);
      }
      return authResponse;
    } catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  signoutUser(): boolean {
    this.currentUserDetails = null;
    this.userPrivilegeList = new Set();
    this.UserLoginEvent.emit(false);
    this.dropSessionId();

    return true;
  }

  async loadLoggedInUserDetails(): Promise<void> {
    if (this.sessionToken) {
      try {
        this.currentUserDetails = <ILoggedInUserDetails>(
          await this.http
            .get(this.backendService.getApiUrl("/getLoggedInUserDetails"))
            .toPromise()
        );
        localStorage.setItem(
          Constants.LOGGED_IN_USER_TYPE,
          this.currentUserDetails.userType
        );
      } catch (error) {
        console.log("Error trying to load logged in user details: ", error);
        if ((<HttpErrorResponse>error).status == 401) {
          this.signoutUser();
        }
      }
    }
  }

  async loadLoggedInUserPrivileges() {
    if (!this.sessionToken) return;
    let searchResponse = <IGetPrivilegesListForLoggedInUserResponseModel>(
      await this.backendService.getPrivilegesListForLoggedInUser()
    );
    if (searchResponse.success == 0) {
      return;
    }
    for (let userPrivilege of searchResponse.userPrivilegeList) {
      this.userPrivilegeList.add(userPrivilege.name);
    }
  }

  async initSessionFromLocalStorage(): Promise<void> {
    let persistedSessionId: string | null = localStorage.getItem(
      Constants.AUTH_SESSION_STORAGE_KEY
    );
    let urlBackendDomainPrefix: string | null = "";
    let loadConfigProperties = false;
    if (isBlank(persistedSessionId)) {
      const urlParams = new URLSearchParams(window.location.search);
      persistedSessionId = urlParams.get("sessionId");
      urlBackendDomainPrefix = urlParams.get("backendPrefix");
      if (!isBlank(persistedSessionId) && persistedSessionId != null) {
        localStorage.setItem(
          Constants.AUTH_SESSION_STORAGE_KEY,
          persistedSessionId
        );
      }
      if (!isBlank(urlBackendDomainPrefix) && urlBackendDomainPrefix != null) {
        localStorage.setItem(
          Constants.BACKEND_DOMAIN_PREFIX,
          urlBackendDomainPrefix
        );
      }
      if (!isBlank(persistedSessionId)) {
        loadConfigProperties = true;
      }
    }
    this.persistSessionId(persistedSessionId);

    let errorCode = localStorage.getItem(Constants.ERROR_CODE);
    // if (isBlank(errorCode) || errorCode != Constants.ERROR_CODE_SERVICE_DOWN) {

    //   await this.loadLoggedInUserDetails();
    //   await this.loadLoggedInUserPrivileges();
    // }
    // if (loadConfigProperties) {
    // }
    // this.UserLoginEvent.emit(true);
     try {
       if (isBlank(errorCode) || errorCode != Constants.ERROR_CODE_SERVICE_DOWN) {
 await this.loadLoggedInUserDetails(); // will silently catch 401 before emitting
    await this.loadLoggedInUserPrivileges();
       }
   
    this.UserLoginEvent.emit(true);
  } catch (err) {
    console.error("Error initializing session:", err);
    // optional: keep user logged out but don't crash app
  }
  }

  public persistSessionId(sessionId: string | null): void {
    this.sessionToken = sessionId;
    if (sessionId !== null) {
      localStorage.setItem(Constants.AUTH_SESSION_STORAGE_KEY, sessionId);
    }
  }

  private dropSessionId(): void {
    this.sessionToken = null;
    localStorage.removeItem(Constants.AUTH_SESSION_STORAGE_KEY);
  }
  doesUserHavePrivilege(privilegeName: string): boolean {
    return this.userPrivilegeList.has(privilegeName);
  }

  addQueryParams(url: string, params: { [key: string]: string | null }) {
    const urlObj = new URL(url);
    Object.keys(params).forEach((key) => {
      if (params[key] !== null) {
        urlObj.searchParams.set(key, params[key] as string);
      }
    });
    return urlObj.toString();
  }
}
