import {IDto} from "./../../dto-base";

export interface IRetrieveCustomFormFieldDto extends IDto 
{
  name: string,
  label: string,
  dataType: string, 
  success :  number,
  alert : string
}
