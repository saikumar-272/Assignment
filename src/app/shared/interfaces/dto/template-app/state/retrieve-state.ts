import {IDto} from "./../../dto-base";

export interface IRetrieveStateDto extends IDto 
{
  countryUUID: string,
  countryDisplayText : string,
  name: string,
  description: string,
  success :  number,
  alert : string
}
