export interface ICreateEmployeeSectionRequestModel {
  employeeUUID: string,
  sectionName: string,
  description: string,
  injectedFieldsDataJsonText?: string,
}
