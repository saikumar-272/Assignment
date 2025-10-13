
export interface retrieveFlexFieldListDataObject{

  name: string,
  description: string,
  enableContext: boolean, 
  globalSegmentsCount: number, 
  isFrozen: boolean, 
  flexFieldUUID: string,

}

export interface retrieveFlexFieldListSearchFilter {
  flexFieldUUID: string,
  code: string,
  name: string,
  description: string,
  enableContext: boolean, 
  globalSegmentsCount: number, 
  pageNumber: number,
  pageSize: number
}
