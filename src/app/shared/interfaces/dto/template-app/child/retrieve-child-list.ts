
export interface retrieveChildListDataObject{

  childFirstName: string,
  childLastName: string,
  parentUUID: string,
  parentDisplayText: string, 
  childUUID: string,

}

export interface retrieveChildListSearchFilter {
  childUUID: string,
  parentUUID: any,
  childFirstName: string,
  childLastName: string,
  pageNumber: number,
  pageSize: number
}
