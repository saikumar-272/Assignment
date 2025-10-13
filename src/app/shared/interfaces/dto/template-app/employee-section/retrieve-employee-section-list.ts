
export interface retrieveEmployeeSectionListDataObject{

  sectionName: string,
  description: string,
  employeeUUID: string,
  employeeDisplayText: string, 
  employeeSectionUUID: string,

}

export interface retrieveEmployeeSectionListSearchFilter {
  employeeSectionUUID: string,
  employeeUUID: any,
  sectionName: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
