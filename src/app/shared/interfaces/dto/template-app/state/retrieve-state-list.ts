
export interface retrieveStateListDataObject{

  countryUUID: string,
  countryDisplayText: string, 
  name: string,
  description: string,
  stateUUID: string,

}

export interface retrieveStateListSearchFilter {
  stateUUID: string,
  countryUUID: any,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
