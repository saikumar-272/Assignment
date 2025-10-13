
export interface retrieveCounryForUploadListDataObject{
  isSelected: boolean,
  name: string,
  code: string,
  counryForUploadUUID: string,

}

export interface retrieveCounryForUploadListSearchFilter {
  counryForUploadUUID: string,
  name: string,
  code: string,
  pageNumber: number,
  pageSize: number
}
