import {IDto} from "./../../dto-base";

export interface IViewProfileDto extends IDto 
{
  firstName: string,
  lastName: string,
  emailId: string,
  contactNo: string,
  success :  number,
  alert : string
}
