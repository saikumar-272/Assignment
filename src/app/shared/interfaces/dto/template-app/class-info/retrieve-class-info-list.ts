
export interface retrieveClassInfoListDataObject{

  name: string,
  description: string,
  classInfoUUID: string,

}

export interface retrieveClassInfoListSearchFilter {
  classInfoUUID: string,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
