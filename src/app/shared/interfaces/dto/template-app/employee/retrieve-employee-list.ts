
export interface retrieveEmployeeListDataObject{
  isSelected: boolean,
  age: number, 
  firstName: string,
  lastName: string,
  emailId: string,
  employeeUUID: string,

}

export interface retrieveEmployeeListSearchFilter {
  joiningDateFrom: string, 
  joiningDateTo: string, 
  employeeUUID: string,
  firstName: string,
  pageNumber: number,
  pageSize: number
}
