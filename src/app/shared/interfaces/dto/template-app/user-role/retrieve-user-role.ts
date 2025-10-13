import {IDto} from "./../../dto-base";

export interface IRetrieveUserRoleDto extends IDto 
{
  privilegeGroupUUID: string,
  privilegeGroupDisplayText : string,
  description: string,
  userInfoUUID: string,
  userInfoDisplayText : string,
  success :  number,
  alert : string
}
