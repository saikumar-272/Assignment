
export interface retrieveStudentListForFacultyDataObject{

  firstName: string,
  lastName: string,
  gender: string, 

}

export interface retrieveStudentListForFacultySearchFilter {
  facultyUUID: any,
  pageNumber: number,
  pageSize: number
}
