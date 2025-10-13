import {IDto} from "./../../dto-base";

export interface IRetrieveFlexfieldContextValueDto extends IDto 
{
  code: string,
  flexfieldUUID: string,
  flexfieldDisplayText : string,
  displayValue: string,
  success :  number,
  alert : string
}
