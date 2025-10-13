import {FileAttachmentDto, IDto} from "./../../dto-base";

export interface IRetrieveEmployeeDto extends IDto 
{
  experience: number,
  enableJobDetails: boolean, 
  attachments: Array<FileAttachmentDto>,
  locationUUID: string,
  locationDisplayText : string,
  joininigDate: string, 
  gender: string, 
  dateTimeField: string,
  dateTimeWithSecondsField: string,
  timeField: string,
  timeWithSecondsField: string,
  location1UUID: string,
  location1DisplayText : string,
  location2UUID: string,
  location2DisplayText : string,
  noOfChildren: number, 
  salary: number, 
  hike: number, 
  objectId: number,
  isUserValidated: boolean, 
  success :  number,
  alert : string
}
