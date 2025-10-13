
export interface retrievePrivilegeGroupItemListDataObject{

  name: string,
  description: string,
  privilegeGroupUUID: string,
  privilegeGroupDisplayText: string, 
  privilegeGroupItemUUID: string,

}

export interface retrievePrivilegeGroupItemListSearchFilter {
  privilegeGroupItemUUID: string,
  name: string,
  description: string,
  privilegeGroupUUID: any,
  pageNumber: number,
  pageSize: number
}
