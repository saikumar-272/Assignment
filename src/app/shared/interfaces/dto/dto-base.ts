export interface IUploadDataRequestModel {
  data?: File,
}

export interface IResponseMessage {
  success: number,
  alert: string,
  errors?: any[],
  errorCode?: string,
}
export interface CreateApiResponseModel {
  uuid?: string,
  success: number,
  alert: string,
  errors?: any[],
  errorCode?: string,
}
export interface RetrieveListResponseModel extends IResponseMessage {
  list: Array<any>,
  matchingSearchResultsCount: number,
  totalPages: number,
  currentPage: number,
}

export interface INestedObjectWithId {
  id: number,
}

export interface ISearchCriteria {
  noOfRecordsToFetch: number,
  noOfRecordsAlreadyFetched: number,
}

export interface IDto {
  id: number,
  displayText: string,
  errorCode?: string,
}

export interface IEntityAttachmentDto {
  id: number,
  fileName: string,
  attributeName: string,
  entityName: string
}

export interface FileAttachmentDto {
  uuid: number,
  fileName: string,
  attributeName: string,
  fileType: string,
  fileUrl: string,
  imageRenderingUrl: string,
  allowPublicAccess: boolean
}

export interface IGetPrivilegesListForLoggedInUserResponseModel
{
success: number,
userPrivilegeList: Array<PrivilegeGroupItemDataObject>
}

export interface PrivilegeGroupItemDataObject
{
name : string,
description : string
}
