import {IDto} from "./../../dto-base";

export interface IRetrieveStudentExamResultDto extends IDto 
{
  studentUUID: string,
  studentDisplayText : string,
  examName: string,
  marks: number, 
  success :  number,
  alert : string
}
