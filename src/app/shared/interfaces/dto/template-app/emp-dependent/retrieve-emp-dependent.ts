import {IDto} from "./../../dto-base";

export interface IRetrieveEmpDependentDto extends IDto 
{
  depEmpName: string,
  employeeSectionUUID: string,
  employeeSectionDisplayText : string,
  depEmpRelationship: string,
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  employeeUUID: string,
  employeeDisplayText : string,
  success :  number,
  alert : string
}
