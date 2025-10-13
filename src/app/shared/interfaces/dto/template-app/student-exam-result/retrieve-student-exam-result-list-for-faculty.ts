
export interface retrieveStudentExamResultListForFacultyDataObject{

  studentUUID: string,
  studentDisplayText: string, 
  examName: string,
  marks: number, 

}

export interface retrieveStudentExamResultListForFacultySearchFilter {
  facultyUUID: any,
  pageNumber: number,
  pageSize: number
}
