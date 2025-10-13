
export interface retrieveAssetListDataObject{

  name: string,
  description: string,
  assetUUID: string,

}

export interface retrieveAssetListSearchFilter {
  assetUUID: string,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
