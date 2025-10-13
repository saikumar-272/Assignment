
export interface retrieveEmpDependentListDataObject{

  depEmpName: string,
  employeeSectionUUID: string,
  employeeSectionDisplayText: string, 
  depEmpRelationship: string,
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  employeeUUID: string,
  employeeDisplayText: string, 
  empDependentUUID: string,

}

export interface retrieveEmpDependentListSearchFilter {
  empDependentUUID: string,
  employeeUUID: any,
  depEmpName: string,
  employeeSectionUUID: any,
  depEmpRelationship: string,
  isPassed: boolean, 
  passMarks: number, 
  pageNumber: number,
  pageSize: number
}
