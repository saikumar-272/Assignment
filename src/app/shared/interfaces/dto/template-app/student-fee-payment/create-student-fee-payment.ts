export interface ICreateStudentFeePaymentRequestModel {
  studentUUID: string,
  name: string,
  amount: number, 
  currency: string,
  emailId: string,
  contactNo: string,
  paymentStatus: string, 
  paymentRequestUUID: string,
  orderCreatedTime: string,
}
