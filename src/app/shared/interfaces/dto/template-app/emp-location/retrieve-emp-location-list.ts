
export interface retrieveEmpLocationListDataObject{

  locationName: string,
  locationType: string, 
  enableLocationNameUpdate: boolean, 
  description: string,
  editor1: string,
  empLocationUUID: string,

}

export interface retrieveEmpLocationListSearchFilter {
  empLocationUUID: string,
  locationName: string,
  locationType: string, 
  enableLocationNameUpdate: boolean, 
  description: string,
  excludeColumnTest: string,
  pageNumber: number,
  pageSize: number
}
