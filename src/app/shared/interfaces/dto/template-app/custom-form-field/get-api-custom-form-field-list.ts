
export interface getApiCustomFormFieldListDataObject{

  name: string,
  label: string,
  dataType: string, 
  apiName: string,
  customFormFieldUUID: string,

}

export interface getApiCustomFormFieldListSearchFilter {
  apiName: string,
  pageNumber: number,
  pageSize: number
}
