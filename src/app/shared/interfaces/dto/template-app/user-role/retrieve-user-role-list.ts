
export interface retrieveUserRoleListDataObject{

  privilegeGroupUUID: string,
  privilegeGroupDisplayText: string, 
  description: string,
  userInfoUUID: string,
  userInfoDisplayText: string, 
  userRoleUUID: string,

}

export interface retrieveUserRoleListSearchFilter {
  userRoleUUID: string,
  privilegeGroupUUID: any,
  description: string,
  userInfoUUID: any,
  pageNumber: number,
  pageSize: number
}
