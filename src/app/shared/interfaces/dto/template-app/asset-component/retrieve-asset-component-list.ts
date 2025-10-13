
export interface retrieveAssetComponentListDataObject{

  name: string,
  description: string,
  assetUUID: string,
  assetDisplayText: string, 
  assetComponentUUID: string,

}

export interface retrieveAssetComponentListSearchFilter {
  assetComponentUUID: string,
  assetUUID: any,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
