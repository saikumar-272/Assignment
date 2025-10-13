
export interface retrieveOrganisationListDataObject{

  isCommissionAgent: boolean, 
  commissionAgentName: string,
  isFranchisee: boolean, 
  franchiseeName: string,
  organisationUUID: string,

}

export interface retrieveOrganisationListSearchFilter {
  organisationUUID: string,
  name: string,
  emailId: string,
  contactNo: string,
  isCommissionAgent: boolean, 
  commissionAgentName: string,
  pageNumber: number,
  pageSize: number
}
