export interface ISendSmsToSelectedStudentsRequestModel {
  ids ?: Array<any>,
  location1UUID: string,
  faculty1UUID: string,
  message: string,
  isPassed: boolean, 
  passMarks: number, 
  failMarks: number, 
  grade: string, 
  gradeAMarks: number, 
  gradeBMarks: number, 
  gradeCMarks: number, 
}
