
export interface retrieveSellerListDataObject{

  firstName: string,
  lastName: string,
  dispatchAddress: string,
  sellerUUID: string,

}

export interface retrieveSellerListSearchFilter {
  sellerUUID: string,
  firstName: string,
  lastName: string,
  pageNumber: number,
  pageSize: number
}
