
export interface retrieveUserInfoListDataObject{

  emailId: string,
  contactNo: string,
  userInfoUUID: string,
  firstName: string,
  lastName: string,

}

export interface retrieveUserInfoListSearchFilter {
  emailId: string,
  contactNo: string,
  userInfoUUID: string,
  firstName: string,
  lastName: string,
  pageNumber: number,
  pageSize: number
}
