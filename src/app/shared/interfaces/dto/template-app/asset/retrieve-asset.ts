import {IDto} from "./../../dto-base";

export interface IRetrieveAssetDto extends IDto 
{
  name: string,
  description: string,
  success :  number,
  alert : string
}
