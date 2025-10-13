
export interface retrieveParentMobileNumberListDataObject{

  parentUUID: string,
  parentDisplayText: string, 
  mobileNumber: string,
  parentMobileNumberUUID: string,

}

export interface retrieveParentMobileNumberListSearchFilter {
  parentMobileNumberUUID: string,
  parentUUID: any,
  mobileNumber: string,
  pageNumber: number,
  pageSize: number
}
