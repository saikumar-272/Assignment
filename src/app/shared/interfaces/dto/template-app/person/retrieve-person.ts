import {IDto} from "./../../dto-base";

export interface IRetrievePersonDto extends IDto 
{
  name: string,
  emailId: string,
  contactNo: string,
  success :  number,
  alert : string
}
