
export interface retrieveFlexfieldContextValueListDataObject{

  code: string,
  flexfieldUUID: string,
  flexfieldDisplayText: string, 
  displayValue: string,
  flexfieldContextValueUUID: string,

}

export interface retrieveFlexfieldContextValueListSearchFilter {
  flexfieldContextValueUUID: string,
  code: string,
  flexfieldUUID: any,
  displayValue: string,
  pageNumber: number,
  pageSize: number
}
