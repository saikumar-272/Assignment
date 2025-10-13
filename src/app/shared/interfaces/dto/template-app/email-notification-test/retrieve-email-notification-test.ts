import {IDto} from "./../../dto-base";

export interface IRetrieveEmailNotificationTestDto extends IDto 
{
  subject: string,
  emailText: string,
  emailId: string,
  isEmailAddedToQueue: boolean, 
  isEmailSent: boolean, 
  success :  number,
  alert : string
}
