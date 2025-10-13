import {IDto} from "./../../dto-base";

export interface IRetrievePrivilegeGroupDto extends IDto 
{
  name: string,
  description: string,
  success :  number,
  alert : string
}
