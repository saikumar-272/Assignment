export interface IUpdateEmployeeAttachmentsRequestModel {
  firstName: string,
  lastName: string,
  emailId: string,
  attachments?: File,
  employeeUUID: string,
  objectId: number,
  isUserValidated: boolean, 
}
