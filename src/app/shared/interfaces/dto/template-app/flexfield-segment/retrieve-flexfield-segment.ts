import {IDto} from "./../../dto-base";

export interface IRetrieveFlexfieldSegmentDto extends IDto 
{
  segmentName: string,
  segmentLabel: string,
  isGlobal: boolean, 
  isMandatory: boolean, 
  segmentOrder: number, 
  isActive: boolean, 
  flexfieldContextValueUUID: string,
  flexfieldContextValueDisplayText : string,
  success :  number,
  alert : string
}
