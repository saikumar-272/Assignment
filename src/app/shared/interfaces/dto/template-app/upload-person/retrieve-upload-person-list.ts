
export interface retrieveUploadPersonListDataObject{
  isSelected: boolean,
  firstName: string,
  lastName: string,
  address: string,
  locationUUID: string,
  locationDisplayText: string, 
  uploadPersonUUID: string,

}

export interface retrieveUploadPersonListSearchFilter {
  uploadPersonUUID: string,
  firstName: string,
  lastName: string,
  address: string,
  locationUUID: any,
  pageNumber: number,
  pageSize: number
}
