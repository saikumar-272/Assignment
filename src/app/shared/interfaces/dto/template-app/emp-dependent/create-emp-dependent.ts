export interface ICreateEmpDependentRequestModel {
  employeeUUID: string,
  depEmpName: string,
  employeeSectionUUID: string,
  depEmpRelationship: string,
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
}
