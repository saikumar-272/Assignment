import {IDto} from "./../../dto-base";

export interface IRetrieveEmployeeBasicDetailsDto extends IDto 
{
  firstName: string,
  lastName: string,
  emailId: string,
  success :  number,
  alert : string
}
