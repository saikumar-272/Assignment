
export interface retrieveEmailNotificationTestListDataObject{

  subject: string,
  emailText: string,
  emailId: string,
  isEmailAddedToQueue: boolean, 
  isEmailSent: boolean, 
  emailNotificationTestUUID: string,

}

export interface retrieveEmailNotificationTestListSearchFilter {
  emailNotificationTestUUID: string,
  subject: string,
  emailText: string,
  emailId: string,
  isEmailAddedToQueue: boolean, 
  isEmailSent: boolean, 
  pageNumber: number,
  pageSize: number
}
