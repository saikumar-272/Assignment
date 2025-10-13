
export interface retrieveCostCenterLineItemListDataObject{

  costCenterName: string,
  employee1UUID: string,
  employee1DisplayText: string, 
  description: string,
  salesInvoiceUUID: string,
  salesInvoiceDisplayText: string, 
  costCenterLineItemUUID: string,

}

export interface retrieveCostCenterLineItemListSearchFilter {
  costCenterLineItemUUID: string,
  salesInvoiceUUID: any,
  costCenterName: string,
  employee1UUID: any,
  description: string,
  pageNumber: number,
  pageSize: number
}
