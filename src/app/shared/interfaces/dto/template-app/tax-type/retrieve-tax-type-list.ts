
export interface retrieveTaxTypeListDataObject{

  name: string,
  description: string,
  taxTypeUUID: string,

}

export interface retrieveTaxTypeListSearchFilter {
  taxTypeUUID: string,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
