import {IDto} from "./../../dto-base";

export interface IRetrieveOrganisationDto extends IDto 
{
  name: string,
  emailId: string,
  contactNo: string,
  isCommissionAgent: boolean, 
  commissionAgentName: string,
  isFranchisee: boolean, 
  franchiseeName: string,
  success :  number,
  alert : string
}
