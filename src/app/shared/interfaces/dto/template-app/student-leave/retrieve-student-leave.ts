import {IDto} from "./../../dto-base";

export interface IRetrieveStudentLeaveDto extends IDto 
{
  name: string,
  leaveDate: string, 
  reason: string,
  success :  number,
  alert : string
}
