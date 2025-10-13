import {IDto} from "./../../dto-base";

export interface IRetrieveFormFieldApiDto extends IDto 
{
  apiName: string,
  description: string,
  customFormFieldUUID: string,
  customFormFieldDisplayText : string,
  success :  number,
  alert : string
}
