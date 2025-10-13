
export interface retrieveBuyerListDataObject{

  firstName: string,
  lastName: string,
  shippingAddress: string,
  buyerUUID: string,

}

export interface retrieveBuyerListSearchFilter {
  buyerUUID: string,
  firstName: string,
  lastName: string,
  pageNumber: number,
  pageSize: number
}
