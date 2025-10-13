import {IDto} from "./../../dto-base";

export interface IRetrieveUserInfoDto extends IDto 
{
  firstName: string,
  lastName: string,
  success :  number,
  alert : string
}
