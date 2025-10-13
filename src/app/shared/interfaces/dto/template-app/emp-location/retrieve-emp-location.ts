import {IDto} from "./../../dto-base";

export interface IRetrieveEmpLocationDto extends IDto 
{
  locationName: string,
  locationType: string, 
  enableLocationNameUpdate: boolean, 
  description: string,
  excludeColumnTest: string,
  editor1: string,
  editor2: string,
  success :  number,
  alert : string
}
