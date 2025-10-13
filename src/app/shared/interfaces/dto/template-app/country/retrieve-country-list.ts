
export interface retrieveCountryListDataObject{

  name: string,
  description: string,
  countryUUID: string,

}

export interface retrieveCountryListSearchFilter {
  countryUUID: string,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
