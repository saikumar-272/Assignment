
export interface retrieveParentListDataObject{
  isSelected: boolean,
  firstName: string,
  lastName: string,
  mobileNumber: string,
  parentUUID: string,
  mobileNumberForUpdate : string

}

export interface retrieveParentListSearchFilter {
  parentUUID: string,
  firstName: string,
  lastName: string,
  mobileNumber: string,
  pageNumber: number,
  pageSize: number
}
