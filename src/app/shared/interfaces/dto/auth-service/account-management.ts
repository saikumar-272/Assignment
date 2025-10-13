export interface ISignupPasswordRequest {
  contactNo: string,
  otp: string,
  password: string,
  retypePassword: string,
}

export interface IResetPasswordUsingContactNoRequest {
  contactNo: string,
  otp: string,
  newPassword: string,
  retypePassword: string,
}

export interface IResetPasswordUsingEmailIdRequest {
  emailId: string,
  otp: string,
  newPassword: string,
  retypePassword: string,
}
