
export interface retrieveFlexfieldSegmentListDataObject{

  segmentName: string,
  segmentLabel: string,
  isGlobal: boolean, 
  isMandatory: boolean, 
  segmentOrder: number, 
  flexfieldContextValueUUID: string,
  flexfieldContextValueDisplayText: string, 
  flexfieldSegmentUUID: string,

}

export interface retrieveFlexfieldSegmentListSearchFilter {
  flexfieldSegmentUUID: string,
  flexfieldContextValueUUID: any,
  segmentName: string,
  segmentLabel: string,
  isGlobal: boolean, 
  isMandatory: boolean, 
  segmentOrder: number, 
  pageNumber: number,
  pageSize: number
}
