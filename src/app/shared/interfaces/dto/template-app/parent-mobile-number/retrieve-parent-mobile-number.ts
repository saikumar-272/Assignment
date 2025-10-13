import {IDto} from "./../../dto-base";

export interface IRetrieveParentMobileNumberDto extends IDto 
{
  parentUUID: string,
  parentDisplayText : string,
  mobileNumber: string,
  success :  number,
  alert : string
}
