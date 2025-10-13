import {IEntityAttachmentDto} from "./../../dto-base";

export interface retrieveFacultyListDataObject{

  firstName: string,
  lastName: string,
  publicPic: Array<IEntityAttachmentDto>,
  privatePic: Array<IEntityAttachmentDto>,
  facultyUUID: string,

}

export interface retrieveFacultyListSearchFilter {
  facultyUUID: string,
  firstName: string,
  lastName: string,
  emailId: string,
  pageNumber: number,
  pageSize: number
}
