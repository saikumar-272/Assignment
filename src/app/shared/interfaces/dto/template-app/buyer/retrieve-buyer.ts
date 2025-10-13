import {IDto} from "./../../dto-base";

export interface IRetrieveBuyerDto extends IDto 
{
  firstName: string,
  lastName: string,
  shippingAddress: string,
  success :  number,
  alert : string
}
