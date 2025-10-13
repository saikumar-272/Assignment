import {IDto} from "./../../dto-base";

export interface IRetrieveSalesInvoiceDto extends IDto 
{
  netAmount: number, 
  invoiceNo: string,
  location1UUID: string,
  location1DisplayText : string,
  invoiceDate: string, 
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  success :  number,
  alert : string
}
