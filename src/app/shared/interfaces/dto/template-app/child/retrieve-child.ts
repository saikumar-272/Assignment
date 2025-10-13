import {IDto} from "./../../dto-base";

export interface IRetrieveChildDto extends IDto 
{
  childFirstName: string,
  childLastName: string,
  parentUUID: string,
  parentDisplayText : string,
  success :  number,
  alert : string
}
