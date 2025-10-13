
export interface retrieveStateForUploadListDataObject{
  isSelected: boolean,
  name: string,
  code: string,
  countryUUID: string,
  countryDisplayText: string, 
  stateForUploadUUID: string,

}

export interface retrieveStateForUploadListSearchFilter {
  stateForUploadUUID: string,
  name: string,
  code: string,
  countryUUID: any,
  pageNumber: number,
  pageSize: number
}
