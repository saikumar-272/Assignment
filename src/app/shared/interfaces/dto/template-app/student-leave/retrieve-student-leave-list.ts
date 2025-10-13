
export interface retrieveStudentLeaveListDataObject{

  name: string,
  leaveDate: string, 
  reason: string,
  studentLeaveUUID: string,

}

export interface retrieveStudentLeaveListSearchFilter {
  studentLeaveUUID: string,
  name: string,
  leaveDate: string, 
  pageNumber: number,
  pageSize: number
}
