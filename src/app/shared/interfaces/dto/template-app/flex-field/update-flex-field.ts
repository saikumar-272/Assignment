export interface IUpdateFlexFieldRequestModel {
  name: string,
  description: string,
  enableContext: boolean, 
  globalSegmentsCount: number, 
  isFrozen: boolean, 
  flexFieldUUID: string,
}
