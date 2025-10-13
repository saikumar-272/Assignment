import {IDto} from "./../../dto-base";

export interface IRetrieveComponentSpareDto extends IDto 
{
  name: string,
  description: string,
  assetComponentUUID: string,
  assetComponentDisplayText : string,
  success :  number,
  alert : string
}
