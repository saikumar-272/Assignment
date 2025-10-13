import {IDto} from "./../../dto-base";

export interface IRetrieveFlexFieldDto extends IDto 
{
  maximumColumnsCount: number, 
  name: string,
  description: string,
  enableContext: boolean, 
  globalSegmentsCount: number, 
  isFrozen: boolean, 
  success :  number,
  alert : string
}
