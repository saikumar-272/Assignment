import {IDto} from "./../../dto-base";

export interface IRetrieveProfileDetailsSSStaffDto extends IDto 
{
  firstName: string,
  lastName: string,
  success :  number,
  alert : string
}
