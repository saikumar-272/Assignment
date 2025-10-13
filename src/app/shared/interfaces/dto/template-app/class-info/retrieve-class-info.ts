import {IDto} from "./../../dto-base";

export interface IRetrieveClassInfoDto extends IDto 
{
  name: string,
  description: string,
  success :  number,
  alert : string
}
