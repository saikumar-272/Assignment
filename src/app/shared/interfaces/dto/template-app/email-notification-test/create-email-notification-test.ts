export interface ICreateEmailNotificationTestRequestModel {
  subject: string,
  emailText: string,
  emailId: string,
  isEmailAddedToQueue: boolean, 
  isEmailSent: boolean, 
}
