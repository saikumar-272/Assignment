export interface IUpdateSalesInvoiceRequestModel {
  invoiceNo: string,
  location1UUID: string,
  invoiceDate: string, 
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  salesInvoiceUUID: string,
  invoiceLineItemList ?: Array<any>,
  costCenterLineItemList ?: Array<any>,
}
