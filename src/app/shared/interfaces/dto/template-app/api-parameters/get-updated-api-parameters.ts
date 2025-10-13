export interface IGetUpdatedApiParametersRequestModel {
  apiName: string,
  apiParameters ?: Array<any>,
}
export interface IGetUpdatedApiParametersResponseModel
{
  apiParameters : Array<any>,
  success :  number,
  alert : string
}
