
export interface retrieveEmployeeBasicDetailsListDataObject{

  firstName: string,
  lastName: string,
  emailId: string,
  employeeUUID: string,

}

export interface retrieveEmployeeBasicDetailsListSearchFilter {
  employeeUUID: string,
  firstName: string,
  pageNumber: number,
  pageSize: number
}
