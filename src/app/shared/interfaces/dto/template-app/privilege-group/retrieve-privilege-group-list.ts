
export interface retrievePrivilegeGroupListDataObject{

  name: string,
  description: string,
  privilegeGroupUUID: string,

}

export interface retrievePrivilegeGroupListSearchFilter {
  privilegeGroupUUID: string,
  name: string,
  description: string,
  pageNumber: number,
  pageSize: number
}
