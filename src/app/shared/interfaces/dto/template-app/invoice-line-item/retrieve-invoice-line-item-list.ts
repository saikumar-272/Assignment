
export interface retrieveInvoiceLineItemListDataObject{

  lastName: string,
  gender: string, 
  isAccountActive: boolean, 
  dateOfBirth: string, 
  dynamicLocationUUID: string,
  dynamicLocationDisplayText: string, 
  staticLocationUUID: string,
  staticLocationDisplayText: string, 
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
  salesInvoiceDisplayText: string, 
  invoiceLineItemUUID: string,

}

export interface retrieveInvoiceLineItemListSearchFilter {
  invoiceLineItemUUID: string,
  salesInvoiceUUID: any,
  lastName: string,
  gender: string, 
  isAccountActive: boolean, 
  dateOfBirth: string, 
  dynamicLocationUUID: any,
  staticLocationUUID: any,
  age: number, 
  percentage: number, 
  collegeId: number,
  dateTimeField: string,
  dateTimeWithSecondsField: string,
  timeField: string,
  timeWithSecondsField: string,
  pageNumber: number,
  pageSize: number
}
