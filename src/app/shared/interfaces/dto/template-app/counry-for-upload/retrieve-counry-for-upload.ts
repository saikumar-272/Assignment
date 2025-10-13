import {IDto} from "./../../dto-base";

export interface IRetrieveCounryForUploadDto extends IDto 
{
  name: string,
  code: string,
  success :  number,
  alert : string
}
