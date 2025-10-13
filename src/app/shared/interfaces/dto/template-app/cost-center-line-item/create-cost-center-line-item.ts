export interface ICreateCostCenterLineItemRequestModel {
  salesInvoiceUUID: string,
  costCenterName: string,
  employee1UUID: string,
  description: string,
  injectedFieldsDataJsonText?: string,
}
