export interface ICreateSalesInvoiceRequestModel {
  invoiceNo: string,
  location1UUID: string,
  invoiceDate: string, 
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  invoiceLineItemList ?: Array<any>,
  costCenterLineItemList ?: Array<any>,
}
