export interface ICreateFlexfieldSegmentRequestModel {
  flexfieldContextValueUUID: string,
  segmentName: string,
  segmentLabel: string,
  isGlobal: boolean, 
  isMandatory: boolean, 
  segmentOrder: number, 
  isActive: boolean, 
}
