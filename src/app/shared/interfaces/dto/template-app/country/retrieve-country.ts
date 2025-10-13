import {IDto} from "./../../dto-base";

export interface IRetrieveCountryDto extends IDto 
{
  name: string,
  description: string,
  success :  number,
  alert : string
}
