export interface IAuthCredentials {
  loginName: string,
  password: string,
  userType?:string
}

export interface IAuthenticationResponse {
  success: number,
  alert: string,
  userId: string,
  userName: string,
  userType: string,
  backendDomainPrefix: string,
  frontEndDomain: string,
  errorCode?: string
}

export interface ILoggedInUserDetails {
  userId: string,
  userType: string,
  contactNo: string,
  emailId: string,
  firstName: string,
  lastName: string,
  profilePicUrl: string,
  
}
