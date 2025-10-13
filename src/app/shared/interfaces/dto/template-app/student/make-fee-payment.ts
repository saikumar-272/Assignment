import {IPaymentDetails} from "../../payment-details"

export interface IMakeFeePaymentRequestModel {
  studentUUID: string,
  amount: number, 
}
export interface IMakeFeePaymentResponseModel
{
  studentFeePaymentUUID: string,
  gatewayName: string,
  paymentDetails : IPaymentDetails,
  gatewayInfo: string,
  success :  number,
  alert : string
}
