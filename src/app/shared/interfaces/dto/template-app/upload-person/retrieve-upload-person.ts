import {IDto} from "./../../dto-base";

export interface IRetrieveUploadPersonDto extends IDto 
{
  firstName: string,
  lastName: string,
  address: string,
  locationUUID: string,
  locationDisplayText : string,
  success :  number,
  alert : string
}
