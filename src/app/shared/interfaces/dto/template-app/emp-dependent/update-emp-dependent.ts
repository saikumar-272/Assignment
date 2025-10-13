export interface IUpdateEmpDependentRequestModel {
  depEmpName: string,
  employeeSectionUUID: string,
  depEmpRelationship: string,
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  empDependentUUID: string,
}
