
export interface retrieveStudentExamResultListDataObject{

  studentUUID: string,
  studentDisplayText: string, 
  examName: string,
  marks: number, 
  studentExamResultUUID: string,

}

export interface retrieveStudentExamResultListSearchFilter {
  studentExamResultUUID: string,
  studentUUID: any,
  examName: string,
  marks: number, 
  pageNumber: number,
  pageSize: number
}
