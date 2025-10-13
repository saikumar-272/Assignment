
export interface retrieveComponentSpareListDataObject{

  name: string,
  description: string,
  assetComponentUUID: string,
  assetComponentDisplayText: string, 
  componentSpareUUID: string,

}

export interface retrieveComponentSpareListSearchFilter {
  componentSpareUUID: string,
  assetComponentUUID: any,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
