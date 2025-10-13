import {IDto} from "./../../dto-base";

export interface IRetrieveParentDto extends IDto 
{
  firstName: string,
  lastName: string,
  mobileNumber: string,
  success :  number,
  alert : string
}
