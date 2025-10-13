
export interface retrievePersonListDataObject{

  name: string,
  emailId: string,
  contactNo: string,
  personUUID: string,

}

export interface retrievePersonListSearchFilter {
  personUUID: string,
  name: string,
  emailId: string,
  contactNo: string,
  pageNumber: number,
  pageSize: number
}
