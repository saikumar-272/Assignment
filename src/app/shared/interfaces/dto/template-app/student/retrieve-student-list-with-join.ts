
export interface retrieveStudentListWithJoinDataObject{

  firstName: string,
  lastName: string,
  sectionName: string,
  className: string,

}

export interface retrieveStudentListWithJoinSearchFilter {
  firstName: string,
  lastName: string,
  pageNumber: number,
  pageSize: number
}
