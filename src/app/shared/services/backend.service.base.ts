import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {toFormData, trimTrailingSlash} from '../util/http-util';
import {environment} from 'src/environments/environment';
import {
    IGetPrivilegesListForLoggedInUserResponseModel,
    IResponseMessage,
    RetrieveListResponseModel
} from '../interfaces/dto/dto-base';
import {Constants, UserType} from '../util/constants';
import {
    IResetPasswordUsingContactNoRequest,
    IResetPasswordUsingEmailIdRequest,
    ISignupPasswordRequest
} from '../interfaces/dto/auth-service/account-management';
import {defer, Observable, of} from 'rxjs';
import {DropDownOption} from '../interfaces/dropdown_option';
import {equalsIgnoreCase, isBlank} from '../util/string-util';
import {DomainService} from './domain.service';

interface ValueObject {
    isDown: boolean;
    timestamp: number;
}

export class BackendServiceBase {

  apiUrl: string = trimTrailingSlash(environment.apiUrl);
  

  constructor(protected http: HttpClient, protected domainService: DomainService) {

  }
  getServicePageUrl(serviceName : string, urlPath : string)
  {
    if(1>2){}
    
    return "";
  }

  public isCodeService(serviceName : string) : boolean
  {
    if(equalsIgnoreCase(serviceName, environment.uiServiceName)){
      return true;
    }
    return false;
  }

  // Commons
  public getApiUrl(endpoint: string): string
  {
    let apiUrl : string = "";
    apiUrl = `${this.apiUrl}${endpoint}`;
    
    let backendDomainPrefix : any = localStorage.getItem(Constants.BACKEND_DOMAIN_PREFIX);
    if(isBlank(backendDomainPrefix)) {
        backendDomainPrefix = "";
    }
    backendDomainPrefix = backendDomainPrefix.trim();
    apiUrl = apiUrl.replace("$$BACKEND_DOMAIN_PREFIX$$", backendDomainPrefix);
     return apiUrl;
  }


  private downloadFile(endpoint: string): Observable<Blob> {
    return this.http.get(this.getApiUrl(endpoint), { responseType: 'blob' });
  }

  async requestOtpForRegistration(userType: UserType, contactNo: string): Promise<IResponseMessage> {
    //FIXME: throw an error if user type is Staff
    try {
      return <IResponseMessage>await this.http.post(this.getApiUrl(`/sendOtpForRegistration${userType}`), toFormData({ contactNo: contactNo })).toPromise();
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  async submitPasswordForSignup(userType: UserType, details: ISignupPasswordRequest): Promise<IResponseMessage> {
    //FIXME: throw an error if user type is Staff
    try {
      return <IResponseMessage>await this.http.post(this.getApiUrl(`/update${userType}PasswordForSignup`), details).toPromise();
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  async requestOtpForResetPasswordUsingEmailId(loginName: string): Promise<IResponseMessage> {
    //FIXME: throw an error if user type is Staff
    try 
    {
      return <IResponseMessage>await this.http.post(this.getApiUrl(`/sendOtpByEmailForResetPassword`), toFormData({ emailId: loginName })).toPromise();
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async requestOtpForResetPasswordUsingContactNo(loginName: string): Promise<IResponseMessage> {
    //FIXME: throw an error if user type is Staff
    try 
    {
      return <IResponseMessage>await this.http.post(this.getApiUrl(`/sendOtpByContactNoForResetPassword`), toFormData({ contactNo: loginName })).toPromise();
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  async resetPasswordUsingEmailId(loginName: string, newPassword: string, retypePassword:string, otp:string): Promise<IResponseMessage> 
  {
    //FIXME: throw an error if user type is Staff
    try {
      const details: IResetPasswordUsingEmailIdRequest = {
        emailId: loginName,
        newPassword: newPassword,
        retypePassword: retypePassword,
        otp: otp,
      }
      return <IResponseMessage>await this.http.post(this.getApiUrl(`/resetPasswordUsingEmailId`), details).toPromise();
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  async resetPasswordUsingContactNo(loginName: string, newPassword: string, retypePassword:string, otp:string): Promise<IResponseMessage> 
  {
    //FIXME: throw an error if user type is Staff
    try {
      const details: IResetPasswordUsingContactNoRequest = {
        contactNo: loginName,
        newPassword: newPassword,
        retypePassword: retypePassword,
        otp: otp,
      }
      return <IResponseMessage>await this.http.post(this.getApiUrl(`/resetPasswordUsingContactNo`), details).toPromise();
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  downloadFileAttachment(id: number, entityName: string): Observable<Blob> {
    let url = "/download" + entityName + "Attachment"
    return this.downloadFile(url + `?id=${id}`);
  }

  async getPrivilegesListForLoggedInUser(): Promise<IGetPrivilegesListForLoggedInUserResponseModel>
  {
    let params = new HttpParams();
    try
    {
      const response: IGetPrivilegesListForLoggedInUserResponseModel = <IGetPrivilegesListForLoggedInUserResponseModel>await this.http.get(this.getApiUrl('/getPrivilegesListForLoggedInUser'), { params: params }).toPromise();
      return response;
    }
    catch (error)
    {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  getMethodDeclaredMapBase(){
    return {
      'retrieveUserInfoListForLookupData': this.retrieveUserInfoListForLookupData,
      'retrievePrivilegeGroupListForLookupData': this.retrievePrivilegeGroupListForLookupData,
      'retrieveEmployeeListForLookupData': this.retrieveEmployeeListForLookupData,
      'retrieveEmpLocationListForLookupData': this.retrieveEmpLocationListForLookupData,
      'retrieveEmployeeSectionListForLookupData': this.retrieveEmployeeSectionListForLookupData,
      'retrieveTaxTypeListForLookupData': this.retrieveTaxTypeListForLookupData,
      'retrieveTaxAccountListForLookupData': this.retrieveTaxAccountListForLookupData,
      'retrieveOrganisationListForLookupData': this.retrieveOrganisationListForLookupData,
      'retrievePersonListForLookupData': this.retrievePersonListForLookupData,
      'retrieveStudentListForLookupData': this.retrieveStudentListForLookupData,
      'retrieveFacultyListForLookupData': this.retrieveFacultyListForLookupData,
      'retrieveFlexFieldListForLookupData': this.retrieveFlexFieldListForLookupData,
      'retrieveFlexfieldContextValueListForLookupData': this.retrieveFlexfieldContextValueListForLookupData,
      'retrieveCountryListForLookupData': this.retrieveCountryListForLookupData,
      'retrieveStateListForLookupData': this.retrieveStateListForLookupData,
      'retrieveAssetListForLookupData': this.retrieveAssetListForLookupData,
      'retrieveClassInfoListForLookupData': this.retrieveClassInfoListForLookupData,
      'retrieveSectionListForLookupData': this.retrieveSectionListForLookupData,
      'retrieveParentListForLookupData': this.retrieveParentListForLookupData,
      'retrieveVehicleListForLookupData': this.retrieveVehicleListForLookupData,
      'retrievePartSupplierListForLookupData': this.retrievePartSupplierListForLookupData,
      'retrieveHostelListForLookupData': this.retrieveHostelListForLookupData,
      'retrieveResidentListForLookupData': this.retrieveResidentListForLookupData,
      'retrieveVoucherListForLookupData': this.retrieveVoucherListForLookupData,
      'retrieveSalesOrderListForLookupData': this.retrieveSalesOrderListForLookupData,
      'retrieveBranchListForLookupData': this.retrieveBranchListForLookupData,
      'retrieveAdmissionListForLookupData': this.retrieveAdmissionListForLookupData,
      'retrieveStateForUploadListForLookupData': this.retrieveStateForUploadListForLookupData,
      'retrieveCounryForUploadListForLookupData': this.retrieveCounryForUploadListForLookupData,
    }
  }
  


  convertPageFieldsFromApi(data: any[]){
    const methodMap: any = this.getMethodDeclaredMap();
    return data.map((d: any) => {
      return {
        className: d.className || 'col-sm-4',
        isQuickAccessField : d.isQuickAccessField || 'false',
        type: d.type,
        key: d.key,
        hide : d.hide || false,
        isPopupField : d.isPopupField || false,
        sectionName : d.sectionName,
        apiName : d.apiName || "",
        showHideDependentFields : d.showHideDependentFields || false,
        showHideSections : d.showHideSections || false,
        defaultValue : d.defaultValue || "",
        flexfieldCode : d.flexfieldCode || "",
        isFlexfield : d.isFlexfield || false,
        isInjectedField : d.isInjectedField || "",
        uiFieldType : d.uiFieldType || "",
        wrappers: ['field-wrapper'],
        templateOptions: this.getTemplateOptions(d, methodMap),
        hooks:{
          onInit: async (field: any) => {
            // field.templateOptions._dependantValueUpdated.next(from(this.loadEmpLocationLookup()));
          }
        },
      }
    })
  }

  getTemplateOptions(d : any, methodMap : any)
  {
    let templateOptions =  {
      label: d.label,
      id: d.id,
      fieldName: d.fieldName,
      objectReference: d.objectReference,
      placeholder: d.placeholder || "",
      parentLookupModelName: d.parentLookupModelName || "",
      parentLookupFieldName: d.parentLookupFieldName || "",
      additionalProperties : d.additionalProperties || "",
      options: [],
      // options$: of([]),
      options$: !d.templateOptions?.realTimeData ? (d.optionsMethod ? methodMap[d.optionsMethod]() : d.templateOptions?.options$ ? d.templateOptions.options$: of([])) : false,
      optionsMethod: d.optionsMethod,
      // _dependantValueUpdated: new Subject<any>(),
      search$: (term: any, formData: any, to: any, backendService: any) => {
        if(to.realTimeData) {
          const methodMap: any = backendService.getMethodDeclaredMap();
          return methodMap[to.optionsMethod].bind(backendService)({ inputText: term, formData: formData, fieldConfig: to });
        }
        return of(to.options.filter((v: any) => v.value.toLowerCase().indexOf(term.toLowerCase()) > -1))
      },
      required: !!d.required,
      refreshData: !!d.templateOptions?.refreshData,
      realTimeData: !!d.templateOptions?.realTimeData,
      suffixButtons: this.getSuffixButtons(d)
    };
    this.updateTemplateOptions(templateOptions, d);
    return templateOptions;
  }

  updateTemplateOptions(templateOptions : any, data : any) {
    return templateOptions;
  }

  getSuffixButtons(data : any)
  {
    let suffixButtonsList = data.templateOptions?.suffixButtons?.map((suffixButton: any) => {
      if(suffixButton.serviceName == null || suffixButton.url ==  null)
        return null;
      suffixButton.external = (suffixButton.serviceName == environment.serviceName ? false : true)
      suffixButton.url = this.getLookupUrl(suffixButton.serviceName, suffixButton.url);
      return suffixButton;
    }) || [];
    if(suffixButtonsList.length == 0)
      return [];
    let suffixButtonInfo = suffixButtonsList[0];
    if(suffixButtonInfo == null)
      return [];
    return suffixButtonsList;
  }

  getLookupUrl(serviceName: any, url: any): any {
    let lookupUrl : string = '/in/' + url;
    
    return lookupUrl;
  }

  getMethodDeclaredMap()
  {
    let methodDeclaredMap : any = this.getMethodDeclaredMapBase();
    return methodDeclaredMap;
  }

  async allowPublicAccess(attachmentUUID : string, apigroupName : string): Promise<IResponseMessage> {
    let url = "/"+apigroupName+"/allow-public-access";
    try
    {
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl(url), toFormData({attachmentUUID})).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.allowPublicAccess(attachmentUUID, apigroupName);
      }
      return response;
    }
    catch (error)
    {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }
  async disablePublicAccess(attachmentUUID : string, apigroupName : string): Promise<IResponseMessage> {
    let url = "/"+apigroupName+"/disable-public-access";
    try
    {
      const response: IResponseMessage = <IResponseMessage>await this.http.post(this.getApiUrl(url), toFormData({attachmentUUID})).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        return this.disablePublicAccess(attachmentUUID, apigroupName);
      }
      return response;
    }
    catch (error)
    {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  

  async getAccountUpgradeStatus(): Promise<any> {
    const params = new HttpParams();
    try {
      const response: any = <any>await this.http.get(this.getApiUrl('/get-account-upgrade-status'), { params: params }).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  async isAuthServiceUp(): Promise<boolean> {
    try {
      const response: HttpResponse<any> = <any>await this.http.get(this.getApiUrl('/health-check'), {observe: 'response'}).toPromise();
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  redirectApiToAnotherServer(response: any): boolean {
    let redirect = false;
    if (!isBlank(response.errorCode)) {
      if (response.errorCode == Constants.ERROR_CODE_USE_NEW_VERSION || response.errorCode == Constants.ERROR_CODE_TRANSITION_TO_STABLE_SERVER) {
        localStorage.setItem(Constants.BACKEND_DOMAIN_PREFIX, response.backendDomainPrefix);
        localStorage.setItem(Constants.NEW_FRONTEND_DOMAIN, response.newFrontendDomain);
      }
      if (response.errorCode == Constants.ERROR_CODE_TRANSITION_TO_STABLE_SERVER) {
        if (!this.domainService.redirectToNewDomain()) {
          redirect = true;
        }
      }
      localStorage.setItem(Constants.ERROR_CODE, response.errorCode);
    }
    return redirect;
  }

  statusCheckDelayinSeconds: number = environment.statusCheckDelay;

  processApiRequest(serviceName ?: string): any {
    let errorCode: any = localStorage.getItem(Constants.ERROR_CODE);
    if (!isBlank(errorCode) && (errorCode == Constants.ERROR_CODE_UPGRADE_IN_PROGRESS
      || errorCode == Constants.ERROR_CODE_USE_NEW_VERSION
      || errorCode == Constants.ERROR_CODE_SERVICE_DOWN
      || (errorCode == Constants.ERROR_CODE_TRANSITION_TO_STABLE_SERVER && this.domainService.redirectToNewDomain()))) {
      localStorage.setItem(Constants.SKIP_ERROR_ALERT, Constants.YES_NO_YES);
      return false;
    }
    else{
      if (this.dontAllowIfBackendServiceDown(serviceName)) {
        localStorage.setItem(Constants.SKIP_ERROR_ALERT, Constants.YES_NO_YES);
        return false;
      }
    }
    localStorage.setItem(Constants.SKIP_ERROR_ALERT, Constants.YES_NO_NO);
    return true;
  }

  dontAllowIfBackendServiceDown(serviceName?: string): any {
    let serviceDownMap: Map<string, ValueObject> = this.getMap(Constants.SERVICE_DOWN_MAP);
    serviceName = serviceName ? serviceName : '';
    let serviceDownInfo: ValueObject | undefined = serviceDownMap.get(serviceName);
    if (serviceDownInfo) {
      let isDown = serviceDownInfo.isDown;
      if (isDown) {
        const currentTime = Date.now();
        const nextAllowedTime = serviceDownInfo.timestamp + this.statusCheckDelayinSeconds;
        if (currentTime <= nextAllowedTime) {
          return true;
        }
        else {
          serviceDownMap.delete(serviceName);
          this.setMap(Constants.SERVICE_DOWN_MAP, serviceDownMap);
        }
      }
    }
  }

  setBackendServerDownInfo(response: any, apiServiceName: string): void {
    let serviceDownInfo: Map<string, ValueObject> = this.getMap(Constants.SERVICE_DOWN_MAP);
    let errorCode = response.errorCode;
    if (!isBlank(errorCode) && errorCode == Constants.ERROR_CODE_SERVICE_DOWN) {
      let serviceName = response.serviceName;
      if (isBlank(serviceName)) {
        serviceName = apiServiceName;
      }
      serviceDownInfo.set(serviceName, { isDown: true, timestamp: Date.now() });
      if (serviceName == 'AuthService') {
        localStorage.setItem(Constants.ERROR_CODE, response.errorCode);
      }
      this.setMap(Constants.SERVICE_DOWN_MAP, serviceDownInfo);
    }
  }

  setMap(key: string, map: Map<string, ValueObject>): void {
    const obj: { [key: string]: ValueObject } = {};
    map.forEach((value, mapKey) => {
      obj[mapKey] = value;
    });
    const jsonString = JSON.stringify(obj);
    localStorage.setItem(key, jsonString);
  }

  getMap(key: string): Map<string, ValueObject> {
    const jsonString = localStorage.getItem(key);
    const obj = jsonString ? JSON.parse(jsonString) : {};
    return new Map<string, ValueObject>(Object.entries(obj));
  }

  showAlert(message: any){
    let skipErrorAlert = localStorage.getItem(Constants.SKIP_ERROR_ALERT);
    if (!isBlank(skipErrorAlert) && skipErrorAlert == Constants.YES_NO_YES) {
      return;
    }
    alert(message);
  }

  getHeaders(apiName : string)
  {
    const headers = new HttpHeaders({
    });
    return headers;
  }
  getAttachmentData(redirectUrl: string, attachmentUUID: string) : Observable<Blob>
  {
    try
    {
      const params = new HttpParams()
      .append('attachmentUUID', attachmentUUID || "");
      const response: any = this.http.get(this.getApiUrl(redirectUrl), { params: params, responseType: 'blob'});
      if(this.redirectApiToAnotherServer(response)) {
        return this.getAttachmentData(redirectUrl, attachmentUUID);
      }
      return response;
    }
    catch (error)
    {
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  //BEGIN LOOKUP APIS
  async retrieveUserInfoListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/user-info/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveUserInfoListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveUserInfoListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveUserInfoListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const userInfoList = await this.retrieveUserInfoListForLookup(inputText);
        return userInfoList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrievePrivilegeGroupListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/privilege-group/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrievePrivilegeGroupListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrievePrivilegeGroupListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrievePrivilegeGroupListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const privilegeGroupList = await this.retrievePrivilegeGroupListForLookup(inputText);
        return privilegeGroupList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveEmployeeListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/employee/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveEmployeeListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveEmployeeListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveEmployeeListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const employeeList = await this.retrieveEmployeeListForLookup(inputText);
        return employeeList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveEmpLocationListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/emp-location/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveEmpLocationListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveEmpLocationListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveEmpLocationListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const empLocationList = await this.retrieveEmpLocationListForLookup(inputText);
        return empLocationList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveEmployeeSectionListForLookup(userInput: string, employeeUUID? : string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      .append('employeeUUID', employeeUUID || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/employee-section/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveEmployeeSectionListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveEmployeeSectionListForLookup(userInput, employeeUUID);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveEmployeeSectionListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        const parentLookupModelName = (fieldConfig['parentLookupModelName'] || "");
        const apiModelData : any = objectReference[parentLookupModelName];
        if(apiModelData != null && apiModelData !== undefined && apiModelData != "undefined")
        {
          const parentLookupFieldName = (fieldConfig['parentLookupFieldName'] || "");
          if(apiModelData[parentLookupFieldName])
          {
            lookupAdditionalInputs['employeeUUID'] = apiModelData[parentLookupFieldName];
          }
        }
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        let employeeUUID =  null;
        if(lookupAdditionalInputs !== null && lookupAdditionalInputs !== undefined)
        {
          employeeUUID = lookupAdditionalInputs["employeeUUID"];
        }
        const employeeSectionList = await this.retrieveEmployeeSectionListForLookup(inputText ,employeeUUID);
        return employeeSectionList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveTaxTypeListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/tax-type/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveTaxTypeListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveTaxTypeListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveTaxTypeListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const taxTypeList = await this.retrieveTaxTypeListForLookup(inputText);
        return taxTypeList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveTaxAccountListForLookup(userInput: string, taxTypeUUID? : string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      .append('taxTypeUUID', taxTypeUUID || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/tax-account/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveTaxAccountListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveTaxAccountListForLookup(userInput, taxTypeUUID);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveTaxAccountListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        let taxTypeUUID =  null;
        if(lookupAdditionalInputs !== null && lookupAdditionalInputs !== undefined)
        {
          taxTypeUUID = lookupAdditionalInputs["taxTypeUUID"];
        }
        const taxAccountList = await this.retrieveTaxAccountListForLookup(inputText ,taxTypeUUID);
        return taxAccountList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveOrganisationListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/organisation/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveOrganisationListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveOrganisationListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveOrganisationListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const organisationList = await this.retrieveOrganisationListForLookup(inputText);
        return organisationList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrievePersonListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/person/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrievePersonListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrievePersonListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrievePersonListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const personList = await this.retrievePersonListForLookup(inputText);
        return personList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveStudentListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/student/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveStudentListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveStudentListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveStudentListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const studentList = await this.retrieveStudentListForLookup(inputText);
        return studentList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveFacultyListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/faculty/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveFacultyListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveFacultyListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveFacultyListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const facultyList = await this.retrieveFacultyListForLookup(inputText);
        return facultyList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveFlexFieldListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/flex-field/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveFlexFieldListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveFlexFieldListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveFlexFieldListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const flexFieldList = await this.retrieveFlexFieldListForLookup(inputText);
        return flexFieldList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveFlexfieldContextValueListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/flexfield-context-value/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveFlexfieldContextValueListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveFlexfieldContextValueListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveFlexfieldContextValueListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const flexfieldContextValueList = await this.retrieveFlexfieldContextValueListForLookup(inputText);
        return flexfieldContextValueList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveCountryListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/country/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveCountryListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveCountryListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveCountryListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const countryList = await this.retrieveCountryListForLookup(inputText);
        return countryList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveStateListForLookup(userInput: string, countryUUID? : string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      .append('countryUUID', countryUUID || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/state/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveStateListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveStateListForLookup(userInput, countryUUID);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveStateListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        const parentLookupModelName = (fieldConfig['parentLookupModelName'] || "");
        const apiModelData : any = objectReference[parentLookupModelName];
        if(apiModelData != null && apiModelData !== undefined && apiModelData != "undefined")
        {
          const parentLookupFieldName = (fieldConfig['parentLookupFieldName'] || "");
          if(apiModelData[parentLookupFieldName])
          {
            lookupAdditionalInputs['countryUUID'] = apiModelData[parentLookupFieldName];
          }
        }
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        let countryUUID =  null;
        if(lookupAdditionalInputs !== null && lookupAdditionalInputs !== undefined)
        {
          countryUUID = lookupAdditionalInputs["countryUUID"];
        }
        const stateList = await this.retrieveStateListForLookup(inputText ,countryUUID);
        return stateList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveAssetListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/asset/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveAssetListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveAssetListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveAssetListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const assetList = await this.retrieveAssetListForLookup(inputText);
        return assetList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveClassInfoListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/class-info/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveClassInfoListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveClassInfoListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveClassInfoListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const classInfoList = await this.retrieveClassInfoListForLookup(inputText);
        return classInfoList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveSectionListForLookup(userInput: string, classInfoUUID? : string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      .append('classInfoUUID', classInfoUUID || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/section/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveSectionListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveSectionListForLookup(userInput, classInfoUUID);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveSectionListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        const parentLookupModelName = (fieldConfig['parentLookupModelName'] || "");
        const apiModelData : any = objectReference[parentLookupModelName];
        if(apiModelData != null && apiModelData !== undefined && apiModelData != "undefined")
        {
          const parentLookupFieldName = (fieldConfig['parentLookupFieldName'] || "");
          if(apiModelData[parentLookupFieldName])
          {
            lookupAdditionalInputs['classInfoUUID'] = apiModelData[parentLookupFieldName];
          }
        }
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        let classInfoUUID =  null;
        if(lookupAdditionalInputs !== null && lookupAdditionalInputs !== undefined)
        {
          classInfoUUID = lookupAdditionalInputs["classInfoUUID"];
        }
        const sectionList = await this.retrieveSectionListForLookup(inputText ,classInfoUUID);
        return sectionList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveParentListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/parent/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveParentListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveParentListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveParentListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const parentList = await this.retrieveParentListForLookup(inputText);
        return parentList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveVehicleListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('Mockservice1')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/vehicle/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveVehicleListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveVehicleListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "Mockservice1");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveVehicleListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const vehicleList = await this.retrieveVehicleListForLookup(inputText);
        return vehicleList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrievePartSupplierListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('Mockservice1')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/part-supplier/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrievePartSupplierListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrievePartSupplierListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "Mockservice1");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrievePartSupplierListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const partSupplierList = await this.retrievePartSupplierListForLookup(inputText);
        return partSupplierList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveHostelListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('Mockservice2')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/hostel/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveHostelListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveHostelListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "Mockservice2");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveHostelListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const hostelList = await this.retrieveHostelListForLookup(inputText);
        return hostelList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveResidentListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('Mockservice2')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/resident/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveResidentListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveResidentListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "Mockservice2");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveResidentListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const residentList = await this.retrieveResidentListForLookup(inputText);
        return residentList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveVoucherListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('Mockservice1')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/voucher/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveVoucherListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveVoucherListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "Mockservice1");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveVoucherListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const voucherList = await this.retrieveVoucherListForLookup(inputText);
        return voucherList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveSalesOrderListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TestSchoolBE')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/sales-order/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveSalesOrderListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveSalesOrderListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TestSchoolBE");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveSalesOrderListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const salesOrderList = await this.retrieveSalesOrderListForLookup(inputText);
        return salesOrderList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveBranchListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TestSchoolBE')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/branch/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveBranchListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveBranchListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TestSchoolBE");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveBranchListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const branchList = await this.retrieveBranchListForLookup(inputText);
        return branchList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveAdmissionListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TestSchoolBE')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/admission/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveAdmissionListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveAdmissionListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TestSchoolBE");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveAdmissionListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const admissionList = await this.retrieveAdmissionListForLookup(inputText);
        return admissionList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveStateForUploadListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/state-for-upload/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveStateForUploadListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveStateForUploadListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveStateForUploadListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const stateForUploadList = await this.retrieveStateForUploadListForLookup(inputText);
        return stateForUploadList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  async retrieveCounryForUploadListForLookup(userInput: string)
  {
    const params = new HttpParams()
      .append('userInput', userInput || "")
      ;
    try
    {
      if (!this.processApiRequest('TemplateApp')) { throw new HttpErrorResponse({ error: { success: 0, alert: "" }}); }
      let response: RetrieveListResponseModel = <RetrieveListResponseModel>await this.http.get(this.getApiUrl('/counry-for-upload/retrieve-list-for-lookup'), { params: params, headers : this.getHeaders("retrieveCounryForUploadListForLookup") }).toPromise();
      if(this.redirectApiToAnotherServer(response)) {
        response = await this.retrieveCounryForUploadListForLookup(userInput);
      }
      if(response.success == 0) {
        this.showAlert(response.alert);
      }
      return response.list;
    }
    catch (error)
    {
      this.setBackendServerDownInfo((<HttpErrorResponse>error).error, "TemplateApp");
      console.log(error);
      return (<HttpErrorResponse>error).error;
    }
  }

  retrieveCounryForUploadListForLookupData(data: {inputText : string, formData?: any, fieldConfig?: any}): Observable<DropDownOption[]>
  {
    const { inputText, formData, fieldConfig } = data;
    return defer(async() => {
      try
      {
        const objectReference = fieldConfig.objectReference;
        let lookupAdditionalInputs = objectReference.getLookupInputsFromAdditionalProperties(fieldConfig);
        lookupAdditionalInputs = objectReference.getLookupSearchData(fieldConfig, lookupAdditionalInputs);
        const counryForUploadList = await this.retrieveCounryForUploadListForLookup(inputText);
        return counryForUploadList.map((d: any) => ({
          id: d.lookupUUID, value: d.lookupDisplayText,
        }));
      }
      catch (error)
      {
        console.log(error);
        return (<HttpErrorResponse>error).error;
      }
    })
  }
  //END LOOKUP APIS
}
