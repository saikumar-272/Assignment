
export interface retrieveFormFieldApiListDataObject{

  apiName: string,
  description: string,
  customFormFieldUUID: string,
  customFormFieldDisplayText: string, 
  formFieldApiUUID: string,

}

export interface retrieveFormFieldApiListSearchFilter {
  formFieldApiUUID: string,
  customFormFieldUUID: any,
  apiName: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
