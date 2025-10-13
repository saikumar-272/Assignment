import {FileAttachmentDto, IDto} from "./../../dto-base";

export interface IRetrieveFacultyDto extends IDto 
{
  publicPic: Array<FileAttachmentDto>,
  privatePic: Array<FileAttachmentDto>,
  firstName: string,
  lastName: string,
  success :  number,
  alert : string
}
