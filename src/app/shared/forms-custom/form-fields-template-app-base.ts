import {
    getCurrentDateInYYYYMMDDFormat,
    getCurrentDateTimeInYYYYMMDDHHMMFormat,
    getCurrentDateTimeInYYYYMMDDHHMMSSFormat
} from '../util/date-util';
import {equalsIgnoreCase} from '../util/string-util';
import {ActivatedRoute, Router} from '@angular/router';
import {FormFieldsBaseComponent} from './form-fields-base';

export class FormFieldsTemplateAppBaseComponent  extends FormFieldsBaseComponent
{
  checkFieldsInjectionEnabledToApi(apiName: String)
  {
    if(apiName  == "retrieveStudentList")
      return true;
    if(apiName  == "createStudent")
      return true;
    if(apiName  == "retrieveStudent")
      return true;
    if(apiName  == "createCostCenterLineItem")
      return true;
    if(apiName  == "retrieveCostCenterLineItemList")
      return true;
    if(apiName  == "updateCostCenterLineItem")
      return true;
    if(apiName  == "retrieveCostCenterLineItem")
      return true;
    if(apiName  == "createEmployeeSection")
      return true;
    if(apiName  == "retrieveEmployeeSectionList")
      return true;
    if(apiName  == "updateEmployeeSection")
      return true;
    if(apiName  == "retrieveEmployeeSection")
      return true;
    return false;
  }

  
  
  
  
  
  
  
  
  

  setDataToFormOnload(apiName: any, router : Router, currentRoute: ActivatedRoute, currentObjectRef : any) {
      if(equalsIgnoreCase(apiName, "retrieveStudentList")) {
        setTimeout(() => {
          currentObjectRef.retrieveStudentListSectionData["gender"] = "Male";
          currentObjectRef.retrieveStudentListSectionData["isAccountActive"] = "true";
          currentObjectRef.retrieveStudentListSectionData["dateTimeField"] = getCurrentDateTimeInYYYYMMDDHHMMFormat();
          currentObjectRef.retrieveStudentListSectionData["dateTimeWithSecondsField"] = getCurrentDateTimeInYYYYMMDDHHMMSSFormat();
        }, 100)
      }
      if(equalsIgnoreCase(apiName, "createStudent")) {
        setTimeout(() => {
          currentObjectRef.section1SectionData["gender"] = "Male";
          currentObjectRef.section1SectionData["isAccountActive"] = "true";
          currentObjectRef.section1SectionData["dateOfBirth"] = getCurrentDateInYYYYMMDDFormat();
          currentObjectRef.section2SectionData["dateTimeField"] = getCurrentDateTimeInYYYYMMDDHHMMFormat();
          currentObjectRef.section2SectionData["dateTimeWithSecondsField"] = getCurrentDateTimeInYYYYMMDDHHMMSSFormat();
        }, 100)
      }
      if(equalsIgnoreCase(apiName, "createFaculty")) {
        setTimeout(() => {
          currentObjectRef.createFacultySectionData["contactNo"] = "8886360108";
        }, 100)
      }
  }
}
