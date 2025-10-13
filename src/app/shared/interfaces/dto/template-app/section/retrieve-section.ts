import {IDto} from "./../../dto-base";

export interface IRetrieveSectionDto extends IDto 
{
  classInfoUUID: string,
  classInfoDisplayText : string,
  name: string,
  description: string,
  success :  number,
  alert : string
}
