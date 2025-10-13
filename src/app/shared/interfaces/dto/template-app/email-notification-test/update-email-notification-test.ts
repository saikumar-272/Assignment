export interface IUpdateEmailNotificationTestRequestModel {
  subject: string,
  emailText: string,
  emailId: string,
  isEmailAddedToQueue: boolean, 
  isEmailSent: boolean, 
  emailNotificationTestUUID: string,
}
