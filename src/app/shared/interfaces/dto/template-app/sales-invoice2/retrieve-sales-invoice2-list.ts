
export interface retrieveSalesInvoice2ListDataObject{

  invoiceNo: string,
  invoiceDate: string, 
  paymentDate: string, 
  paymentTime: string,
  buyerType: string, 
  organisationUUID: string,
  organisationDisplayText: string, 
  personUUID: string,
  personDisplayText: string, 
  buyerUUID: string,
  salesInvoice2UUID: string,

}

export interface retrieveSalesInvoice2ListSearchFilter {
  salesInvoice2UUID: string,
  invoiceNo: string,
  invoiceDate: string, 
  paymentDate: string, 
  paymentTime: string,
  buyerType: string, 
  organisationUUID: any,
  personUUID: any,
  buyerUUID: string,
  pageNumber: number,
  pageSize: number
}
