import {IDto} from "./../../dto-base";

export interface IRetrieveSellerDto extends IDto 
{
  firstName: string,
  lastName: string,
  dispatchAddress: string,
  success :  number,
  alert : string
}
