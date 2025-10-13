
export interface retrieveSectionListDataObject{

  classInfoUUID: string,
  classInfoDisplayText: string, 
  name: string,
  description: string,
  sectionUUID: string,

}

export interface retrieveSectionListSearchFilter {
  sectionUUID: string,
  classInfoUUID: any,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
