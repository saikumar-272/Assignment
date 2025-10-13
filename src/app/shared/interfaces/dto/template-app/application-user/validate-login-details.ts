export interface IValidateLoginDetailsRequestModel {
  userName: string,
  password: string,
  userType: string,
}
export interface IValidateLoginDetailsResponseModel
{
  responseCode: string,
  nextInput: string,
  responseMessage: string,
  success :  number,
  alert : string
}
