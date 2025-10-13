
export interface retrieveSalesInvoiceListDataObject{

  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  salesInvoiceUUID: string,

}

export interface retrieveSalesInvoiceListSearchFilter {
  salesInvoiceUUID: string,
  invoiceNo: string,
  location1UUID: any,
  invoiceDate: string, 
  isPassed: boolean, 
  passMarks: number, 
  pageNumber: number,
  pageSize: number
}
