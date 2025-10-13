import {IDto} from "./../../dto-base";

export interface IRetrieveAssetComponentDto extends IDto 
{
  name: string,
  description: string,
  assetUUID: string,
  assetDisplayText : string,
  success :  number,
  alert : string
}
