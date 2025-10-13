import {IDto} from "./../../dto-base";

export interface IRetrieveTaxTypeDto extends IDto 
{
  name: string,
  description: string,
  success :  number,
  alert : string
}
