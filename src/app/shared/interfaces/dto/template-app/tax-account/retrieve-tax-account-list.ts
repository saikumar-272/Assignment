
export interface retrieveTaxAccountListDataObject{

  name: string,
  taxTypeUUID: string,
  taxTypeDisplayText: string, 
  taxAccountUUID: string,

}

export interface retrieveTaxAccountListSearchFilter {
  taxAccountUUID: string,
  name: string,
  taxTypeUUID: any,
  pageNumber: number,
  pageSize: number
}
