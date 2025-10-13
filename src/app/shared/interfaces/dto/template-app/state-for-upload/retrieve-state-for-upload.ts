import {IDto} from "./../../dto-base";

export interface IRetrieveStateForUploadDto extends IDto 
{
  name: string,
  code: string,
  countryUUID: string,
  countryDisplayText : string,
  success :  number,
  alert : string
}
