import {IDto} from "./../../dto-base";

export interface IRetrieveEmployeeSectionDto extends IDto 
{
  sectionName: string,
  description: string,
  employeeUUID: string,
  employeeDisplayText : string,
  success :  number,
  alert : string
}
