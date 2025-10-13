import {IDto} from "./../../dto-base";

export interface IRetrieveCostCenterLineItemDto extends IDto 
{
  costCenterName: string,
  employee1UUID: string,
  employee1DisplayText : string,
  description: string,
  salesInvoiceUUID: string,
  salesInvoiceDisplayText : string,
  success :  number,
  alert : string
}
