import {IDto} from "./../../dto-base";

export interface IRetrieveInvoiceLineItemDto extends IDto 
{
  productName: string,
  lastName: string,
  gender: string, 
  faculty1UUID: string,
  faculty1DisplayText : string,
  isAccountActive: boolean, 
  dateOfBirth: string, 
  dynamicLocationUUID: string,
  dynamicLocationDisplayText : string,
  staticLocationUUID: string,
  staticLocationDisplayText : string,
  age: number, 
  percentage: number, 
  collegeId: number,
  dateTimeField: string,
  dateTimeWithSecondsField: string,
  timeField: string,
  timeWithSecondsField: string,
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  salesInvoiceUUID: string,
  salesInvoiceDisplayText : string,
  success :  number,
  alert : string
}
