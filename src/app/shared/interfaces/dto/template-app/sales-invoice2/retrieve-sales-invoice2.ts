import {IDto} from "./../../dto-base";

export interface IRetrieveSalesInvoice2Dto extends IDto 
{
  invoiceNo: string,
  location1UUID: string,
  location1DisplayText : string,
  invoiceDate: string, 
  paymentDate: string, 
  paymentTime: string,
  buyerType: string, 
  organisationUUID: string,
  organisationDisplayText : string,
  personUUID: string,
  personDisplayText : string,
  buyerUUID: string,
  success :  number,
  alert : string
}
