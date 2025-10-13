import {IDto} from "./../../dto-base";

export interface IRetrieveTaxAccountDto extends IDto 
{
  name: string,
  taxTypeUUID: string,
  taxTypeDisplayText : string,
  success :  number,
  alert : string
}
