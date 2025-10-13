import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {BackendService} from 'src/app/shared/services/backend.service';
import MenuHierarchy from 'src/app/shared/MenuHierarchy.json';
import {equalsIgnoreCase, isBlank} from 'src/app/shared/util/string-util';
import {UserType} from 'src/app/shared/util/constants';

declare let $: any;

@Component({
  selector: 'parent-app-second-main-menu',
  templateUrl: './parent-second-main-menu.component.html',
  styleUrls: ['./parent-second-main-menu.component.scss']
})
export class ParentSecondMainMenuComponent implements OnInit {
@Output() showSideMenu = new EventEmitter<string>();
@Output() mouseEnter = new EventEmitter<string>();
@Output() mouseLeave = new EventEmitter<string>();
@Input() userType: string | null = '';
privilegedMenus: any = [];
menus: any = [];

constructor(private backendService: BackendService, private authenticationService : AuthenticationService) { }

  ngOnInit(): void {
    // https://bootstrap-menu.com/detail-multilevel.html
    //this.privilegedMenus = ["1.2.3", "1.3.3", "2.1", "2.2", "3", "4"];
    this.loadMenu();
  }

  //Recursively remove empty objects
  clearEmptyObjects(obj: any): any {
    if (Array.isArray(obj)) {
      // If it's an array, process each element and filter out empty objects
      return obj
        .map(item => this.clearEmptyObjects(item)) // Recursively process each item
        .filter(item => item && Object.keys(item).length > 0); // Remove completely empty objects
    } else if (typeof obj === 'object' && obj !== null) {
      // If it's an object, process each key recursively
      Object.keys(obj).forEach(key => {
        obj[key] = this.clearEmptyObjects(obj[key]); // Recursively clean nested objects
      });
      // If the object has no keys, remove it
      return Object.keys(obj).length > 0 ? obj : null;
    } else {
      // For non-object types, return them as is
      return obj;
    }
  }

  getPrivilegedMenus(){
    let menus: any = this.clearEmptyObjects(MenuHierarchy);
    menus = this.getUserApplicableMenus(this.userType, menus);
    // iterate, mark eligibility & remove non-eligibles...
    menus.map((m1: any) => { // 1
      m1.level = 1;
      m1.menus?.map((m2: any) => { // 1.1
        m2.level = 2;
        m2.menus?.map((m3: any) => { // 1.1.1
          m3.level = 3;
          m3.menus?.map((m4: any) => { // 1.1.1.1
            m4.level = 4;
            m4.menus?.map((m5: any) => { // 1.1.1.1.1
              m5.level = 5;
              m5.menus?.map((m6: any) => { // 1.1.1.1.1
                m6.level = 6;
                m6.flag = m6.menus?.filter((m7: any) => m7.flag).length > 0 || this.privilegedMenus.includes(m6.code) || this.privilegedMenus.includes(m5.code);
              })
              m5.menus = m5.menus?.filter((m6: any) => m6.flag)
              if(m4.menus?.length === 0) delete m4.menus;
              m5.flag = m5.menus?.filter((m6: any) => m6.flag).length > 0 || this.privilegedMenus.includes(m5.code) || this.privilegedMenus.includes(m4.code);
            })
            m4.menus = m4.menus?.filter((m5: any) => m5.flag)
            if(m4.menus?.length === 0) delete m4.menus;
            m4.flag = m4.menus?.filter((m5: any) => m5.flag).length > 0 || this.privilegedMenus.includes(m4.code) || this.privilegedMenus.includes(m3.code);
          })
          m3.menus = m3.menus?.filter((m4: any) => m4.flag)
          if(m3.menus?.length === 0) delete m3.menus;
          m3.flag = m3.menus?.filter((m4: any) => m4.flag).length > 0 || this.privilegedMenus.includes(m3.code) || this.privilegedMenus.includes(m2.code);
        });
        m2.menus = m2.menus?.filter((m3: any) => m3.flag)
        if(m2.menus?.length === 0) delete m2.menus;
        m2.flag = m2.menus?.length > 0 || this.privilegedMenus.includes(m2.code) || this.privilegedMenus.includes(m1.code);
      });
      m1.menus = m1.menus?.filter((m2: any) => m2.flag)
      if(m1.menus?.length === 0) delete m1.menus;
      m1.flag = m1.menus?.length > 0 || this.privilegedMenus.includes(m1.code)
    })
    return menus.filter((m1: any) => m1.flag);
  }

  async loadMenu()
  {
    let userPrivilegeList = this.authenticationService.userPrivilegeList;
    this.privilegedMenus = Array.from(userPrivilegeList.values());
    this.privilegedMenus.push("CreateNewStaffUser");
    this.privilegedMenus.push("CreateNewStaffUser");
    this.privilegedMenus.push("CreateNewStaffUser");
    this.privilegedMenus.push("CreateNewStaffUser");
    this.privilegedMenus.push("RetrieveUserInfo");
    this.privilegedMenus.push("RetrieveUserInfo");
    this.privilegedMenus.push("RetrieveUserInfo");
    this.privilegedMenus.push("RetrieveUserInfo");
    this.privilegedMenus.push("RetrieveUserInfoList");
    this.privilegedMenus.push("RetrieveUserInfoList");
    this.privilegedMenus.push("RetrieveUserInfoList");
    this.privilegedMenus.push("RetrieveUserInfoList");
    this.privilegedMenus.push("ViewProfile");
    this.privilegedMenus.push("ViewProfile");
    this.privilegedMenus.push("ViewProfile");
    this.privilegedMenus.push("ViewProfile");
    this.privilegedMenus.push("RetrieveEmployeeBasicDetailsList");
    this.privilegedMenus.push("RetrieveEmployeeBasicDetailsList");
    this.privilegedMenus.push("RetrieveEmployeeList");
    this.privilegedMenus.push("RetrieveEmployeeList");
    this.privilegedMenus.push("RetrieveStudentList");
    this.privilegedMenus.push("RetrieveStudentList");
    this.privilegedMenus.push("GetApiCustomFormFieldList");
    this.privilegedMenus.push("GetApiCustomFormFieldList");
    this.privilegedMenus.push("CreateCustomFormField");
    this.privilegedMenus.push("CreateCustomFormField");
    this.privilegedMenus.push("UpdateCustomFormField");
    this.privilegedMenus.push("UpdateCustomFormField");
    this.privilegedMenus.push("GetStudentGraphData");
    this.privilegedMenus.push("CreateStudentForFlexfields");
    this.privilegedMenus.push("CreateStudentForFlexfields");
    this.privilegedMenus.push("CreateEmployeeForFlexfields");
    this.privilegedMenus.push("CreateEmployeeForFlexfields");
    this.privilegedMenus.push("RetrieveStudentListForFaculty");
    this.privilegedMenus.push("RetrieveStudentListForFaculty");
    this.privilegedMenus.push("RetrieveStudentExamResultListForFaculty");
    this.privilegedMenus.push("RetrieveStudentExamResultListForFaculty");
    this.privilegedMenus.push("RetrieveStudentListWithJoin");
    this.privilegedMenus.push("RetrieveStudentListWithJoin");
    this.privilegedMenus.push("RetrieveMaleGenderStudents");
    this.privilegedMenus.push("RetrieveMaleGenderStudents");
    this.privilegedMenus.push("CreateStudent");
    this.privilegedMenus.push("CreateStudent");
    this.privilegedMenus.push("RetrieveStudent");
    this.privilegedMenus.push("RetrieveStudent");
    this.privilegedMenus.push("RetrieveVoucherList");
    this.privilegedMenus.push("RetrieveSalesOrderList");
    this.privilegedMenus.push("RetrieveFacultyList");
    this.privilegedMenus.push("RetrieveFacultyList");
    this.privilegedMenus.push("RetrieveFacultyList");
    this.privilegedMenus.push("RetrieveUploadPersonList");
    this.privilegedMenus.push("UpdateUserInfo");
    this.privilegedMenus.push("UpdateUserInfo");
    this.privilegedMenus.push("UpdateUserInfo");
    this.privilegedMenus.push("UpdateUserInfo");
    this.privilegedMenus.push("CreatePrivilegeGroup");
    this.privilegedMenus.push("CreatePrivilegeGroup");
    this.privilegedMenus.push("CreatePrivilegeGroup");
    this.privilegedMenus.push("CreatePrivilegeGroup");
    this.privilegedMenus.push("UpdatePrivilegeGroup");
    this.privilegedMenus.push("UpdatePrivilegeGroup");
    this.privilegedMenus.push("UpdatePrivilegeGroup");
    this.privilegedMenus.push("UpdatePrivilegeGroup");
    this.privilegedMenus.push("RetrievePrivilegeGroup");
    this.privilegedMenus.push("RetrievePrivilegeGroup");
    this.privilegedMenus.push("RetrievePrivilegeGroup");
    this.privilegedMenus.push("RetrievePrivilegeGroup");
    this.privilegedMenus.push("RetrievePrivilegeGroupList");
    this.privilegedMenus.push("RetrievePrivilegeGroupList");
    this.privilegedMenus.push("RetrievePrivilegeGroupList");
    this.privilegedMenus.push("RetrievePrivilegeGroupList");
    this.privilegedMenus.push("CreateUserRole");
    this.privilegedMenus.push("CreateUserRole");
    this.privilegedMenus.push("CreateUserRole");
    this.privilegedMenus.push("CreateUserRole");
    this.privilegedMenus.push("RetrieveUserRole");
    this.privilegedMenus.push("RetrieveUserRole");
    this.privilegedMenus.push("RetrieveUserRole");
    this.privilegedMenus.push("RetrieveUserRole");
    this.privilegedMenus.push("RetrieveUserRoleList");
    this.privilegedMenus.push("RetrieveUserRoleList");
    this.privilegedMenus.push("RetrieveUserRoleList");
    this.privilegedMenus.push("RetrieveUserRoleList");
    this.privilegedMenus.push("CreateEmployee");
    this.privilegedMenus.push("CreateEmployee");
    this.privilegedMenus.push("UpdateEmployee");
    this.privilegedMenus.push("UpdateEmployee");
    this.privilegedMenus.push("RetrieveEmployee");
    this.privilegedMenus.push("RetrieveEmployee");
    this.privilegedMenus.push("CreateEmpLocation");
    this.privilegedMenus.push("CreateEmpLocation");
    this.privilegedMenus.push("UpdateEmpLocation");
    this.privilegedMenus.push("UpdateEmpLocation");
    this.privilegedMenus.push("RetrieveEmpLocation");
    this.privilegedMenus.push("RetrieveEmpLocation");
    this.privilegedMenus.push("RetrieveEmpLocationList");
    this.privilegedMenus.push("RetrieveEmpLocationList");
    this.privilegedMenus.push("CreateTaxType");
    this.privilegedMenus.push("CreateTaxType");
    this.privilegedMenus.push("UpdateTaxType");
    this.privilegedMenus.push("UpdateTaxType");
    this.privilegedMenus.push("RetrieveTaxType");
    this.privilegedMenus.push("RetrieveTaxType");
    this.privilegedMenus.push("RetrieveTaxTypeList");
    this.privilegedMenus.push("RetrieveTaxTypeList");
    this.privilegedMenus.push("CreateTaxAccount");
    this.privilegedMenus.push("CreateTaxAccount");
    this.privilegedMenus.push("UpdateTaxAccount");
    this.privilegedMenus.push("UpdateTaxAccount");
    this.privilegedMenus.push("RetrieveTaxAccount");
    this.privilegedMenus.push("RetrieveTaxAccount");
    this.privilegedMenus.push("RetrieveTaxAccountList");
    this.privilegedMenus.push("RetrieveTaxAccountList");
    this.privilegedMenus.push("CreateSalesInvoice2");
    this.privilegedMenus.push("UpdateSalesInvoice2");
    this.privilegedMenus.push("RetrieveSalesInvoice2");
    this.privilegedMenus.push("RetrieveSalesInvoice2List");
    this.privilegedMenus.push("CreateOrganisation");
    this.privilegedMenus.push("CreateOrganisation");
    this.privilegedMenus.push("UpdateOrganisation");
    this.privilegedMenus.push("UpdateOrganisation");
    this.privilegedMenus.push("RetrieveOrganisation");
    this.privilegedMenus.push("RetrieveOrganisation");
    this.privilegedMenus.push("RetrieveOrganisationList");
    this.privilegedMenus.push("RetrieveOrganisationList");
    this.privilegedMenus.push("CreatePerson");
    this.privilegedMenus.push("CreatePerson");
    this.privilegedMenus.push("UpdatePerson");
    this.privilegedMenus.push("UpdatePerson");
    this.privilegedMenus.push("RetrievePerson");
    this.privilegedMenus.push("RetrievePerson");
    this.privilegedMenus.push("RetrievePersonList");
    this.privilegedMenus.push("RetrievePersonList");
    this.privilegedMenus.push("CreateSalesInvoice");
    this.privilegedMenus.push("CreateSalesInvoice");
    this.privilegedMenus.push("UpdateSalesInvoice");
    this.privilegedMenus.push("UpdateSalesInvoice");
    this.privilegedMenus.push("RetrieveSalesInvoice");
    this.privilegedMenus.push("RetrieveSalesInvoice");
    this.privilegedMenus.push("RetrieveSalesInvoiceList");
    this.privilegedMenus.push("RetrieveSalesInvoiceList");
    this.privilegedMenus.push("UpdateStudent");
    this.privilegedMenus.push("UpdateStudent");
    this.privilegedMenus.push("CreateFaculty");
    this.privilegedMenus.push("CreateFaculty");
    this.privilegedMenus.push("CreateFaculty");
    this.privilegedMenus.push("UpdateFaculty");
    this.privilegedMenus.push("UpdateFaculty");
    this.privilegedMenus.push("UpdateFaculty");
    this.privilegedMenus.push("RetrieveFaculty");
    this.privilegedMenus.push("RetrieveFaculty");
    this.privilegedMenus.push("RetrieveFaculty");
    this.privilegedMenus.push("CreateStudentExamResult");
    this.privilegedMenus.push("CreateStudentExamResult");
    this.privilegedMenus.push("UpdateStudentExamResult");
    this.privilegedMenus.push("UpdateStudentExamResult");
    this.privilegedMenus.push("RetrieveStudentExamResult");
    this.privilegedMenus.push("RetrieveStudentExamResult");
    this.privilegedMenus.push("RetrieveStudentExamResultList");
    this.privilegedMenus.push("RetrieveStudentExamResultList");
    this.privilegedMenus.push("RetrieveCustomFormField");
    this.privilegedMenus.push("RetrieveCustomFormField");
    this.privilegedMenus.push("UpdateFlexField");
    this.privilegedMenus.push("UpdateFlexField");
    this.privilegedMenus.push("RetrieveFlexField");
    this.privilegedMenus.push("RetrieveFlexField");
    this.privilegedMenus.push("RetrieveFlexFieldList");
    this.privilegedMenus.push("RetrieveFlexFieldList");
    this.privilegedMenus.push("CreateFlexfieldContextValue");
    this.privilegedMenus.push("CreateFlexfieldContextValue");
    this.privilegedMenus.push("UpdateFlexfieldContextValue");
    this.privilegedMenus.push("UpdateFlexfieldContextValue");
    this.privilegedMenus.push("RetrieveFlexfieldContextValue");
    this.privilegedMenus.push("RetrieveFlexfieldContextValue");
    this.privilegedMenus.push("RetrieveFlexfieldContextValueList");
    this.privilegedMenus.push("RetrieveFlexfieldContextValueList");
    this.privilegedMenus.push("CreateCountry");
    this.privilegedMenus.push("CreateCountry");
    this.privilegedMenus.push("UpdateCountry");
    this.privilegedMenus.push("UpdateCountry");
    this.privilegedMenus.push("RetrieveCountry");
    this.privilegedMenus.push("RetrieveCountry");
    this.privilegedMenus.push("RetrieveCountryList");
    this.privilegedMenus.push("RetrieveCountryList");
    this.privilegedMenus.push("CreateState");
    this.privilegedMenus.push("CreateState");
    this.privilegedMenus.push("UpdateState");
    this.privilegedMenus.push("UpdateState");
    this.privilegedMenus.push("RetrieveState");
    this.privilegedMenus.push("RetrieveState");
    this.privilegedMenus.push("RetrieveStateList");
    this.privilegedMenus.push("RetrieveStateList");
    this.privilegedMenus.push("CreateAsset");
    this.privilegedMenus.push("CreateAsset");
    this.privilegedMenus.push("CreateAsset");
    this.privilegedMenus.push("UpdateAsset");
    this.privilegedMenus.push("UpdateAsset");
    this.privilegedMenus.push("UpdateAsset");
    this.privilegedMenus.push("RetrieveAsset");
    this.privilegedMenus.push("RetrieveAsset");
    this.privilegedMenus.push("RetrieveAsset");
    this.privilegedMenus.push("RetrieveAssetList");
    this.privilegedMenus.push("RetrieveAssetList");
    this.privilegedMenus.push("RetrieveAssetList");
    this.privilegedMenus.push("CreateClassInfo");
    this.privilegedMenus.push("CreateClassInfo");
    this.privilegedMenus.push("CreateClassInfo");
    this.privilegedMenus.push("UpdateClassInfo");
    this.privilegedMenus.push("UpdateClassInfo");
    this.privilegedMenus.push("UpdateClassInfo");
    this.privilegedMenus.push("RetrieveClassInfo");
    this.privilegedMenus.push("RetrieveClassInfo");
    this.privilegedMenus.push("RetrieveClassInfo");
    this.privilegedMenus.push("RetrieveClassInfoList");
    this.privilegedMenus.push("RetrieveClassInfoList");
    this.privilegedMenus.push("RetrieveClassInfoList");
    this.privilegedMenus.push("CreateSection");
    this.privilegedMenus.push("CreateSection");
    this.privilegedMenus.push("UpdateSection");
    this.privilegedMenus.push("UpdateSection");
    this.privilegedMenus.push("RetrieveSection");
    this.privilegedMenus.push("RetrieveSection");
    this.privilegedMenus.push("RetrieveSectionList");
    this.privilegedMenus.push("RetrieveSectionList");
    this.privilegedMenus.push("UpdateMultiplicationTable");
    this.privilegedMenus.push("CreateEmailNotificationTest");
    this.privilegedMenus.push("CreateEmailNotificationTest");
    this.privilegedMenus.push("UpdateEmailNotificationTest");
    this.privilegedMenus.push("UpdateEmailNotificationTest");
    this.privilegedMenus.push("RetrieveEmailNotificationTest");
    this.privilegedMenus.push("RetrieveEmailNotificationTest");
    this.privilegedMenus.push("RetrieveEmailNotificationTestList");
    this.privilegedMenus.push("RetrieveEmailNotificationTestList");
    this.privilegedMenus.push("CreateParent");
    this.privilegedMenus.push("UpdateParent");
    this.privilegedMenus.push("RetrieveParent");
    this.privilegedMenus.push("RetrieveParentList");
    this.privilegedMenus.push("CreateVehicle");
    this.privilegedMenus.push("UpdateVehicle");
    this.privilegedMenus.push("RetrieveVehicle");
    this.privilegedMenus.push("RetrieveVehicleList");
    this.privilegedMenus.push("CreatePartSupplier");
    this.privilegedMenus.push("UpdatePartSupplier");
    this.privilegedMenus.push("RetrievePartSupplier");
    this.privilegedMenus.push("RetrievePartSupplierList");
    this.privilegedMenus.push("CreateHostel");
    this.privilegedMenus.push("UpdateHostel");
    this.privilegedMenus.push("RetrieveHostel");
    this.privilegedMenus.push("RetrieveHostelList");
    this.privilegedMenus.push("CreateResident");
    this.privilegedMenus.push("UpdateResident");
    this.privilegedMenus.push("RetrieveResident");
    this.privilegedMenus.push("RetrieveResidentList");
    this.privilegedMenus.push("CreateVoucher");
    this.privilegedMenus.push("UpdateVoucher");
    this.privilegedMenus.push("RetrieveVoucher");
    this.privilegedMenus.push("CreateSalesOrder");
    this.privilegedMenus.push("UpdateSalesOrder");
    this.privilegedMenus.push("RetrieveSalesOrder");
    this.privilegedMenus.push("CreateBranch");
    this.privilegedMenus.push("UpdateBranch");
    this.privilegedMenus.push("RetrieveBranch");
    this.privilegedMenus.push("RetrieveBranchList");
    this.privilegedMenus.push("CreateAdmission");
    this.privilegedMenus.push("UpdateAdmission");
    this.privilegedMenus.push("RetrieveAdmission");
    this.privilegedMenus.push("RetrieveAdmissionList");
    this.privilegedMenus.push("CreateUploadPerson");
    this.privilegedMenus.push("UpdateUploadPerson");
    this.privilegedMenus.push("RetrieveUploadPerson");
    this.privilegedMenus.push("CreateStateForUpload");
    this.privilegedMenus.push("UpdateStateForUpload");
    this.privilegedMenus.push("RetrieveStateForUpload");
    this.privilegedMenus.push("RetrieveStateForUploadList");
    this.privilegedMenus.push("CreateCounryForUpload");
    this.privilegedMenus.push("UpdateCounryForUpload");
    this.privilegedMenus.push("RetrieveCounryForUpload");
    this.privilegedMenus.push("RetrieveCounryForUploadList");
    this.privilegedMenus.push("CreateStudentLeave");
    this.privilegedMenus.push("UpdateStudentLeave");
    this.privilegedMenus.push("RetrieveStudentLeave");
    this.privilegedMenus.push("RetrieveStudentLeaveList");
    this.menus = this.getPrivilegedMenus();
  }
  getServicePageUrl(serviceName : string, urlPath : string)
  {
    return this.backendService.getServicePageUrl(serviceName, urlPath);
  }
  doesServiceBelongsToCodeService(serviceName: string) : boolean
  {
    if(1>2){}
    if(equalsIgnoreCase(serviceName, "templateappui") && this.backendService.isCodeService("templateappui")){
      return true;
    }
    if(equalsIgnoreCase(serviceName, "tempappuischool") && this.backendService.isCodeService("tempappuischool")){
      return true;
    }
    if(equalsIgnoreCase(serviceName, "testservice2ui") && this.backendService.isCodeService("testservice2ui")){
      return true;
    }
    if(equalsIgnoreCase(serviceName, "testschoolfe") && this.backendService.isCodeService("testschoolfe")){
      return true;
    }
    if(equalsIgnoreCase(serviceName, "mockservice1ui") && this.backendService.isCodeService("mockservice1ui")){
      return true;
    }
    if(equalsIgnoreCase(serviceName, "mockservice2ui") && this.backendService.isCodeService("mockservice2ui")){
      return true;
    }
    
    return false;
  }

  getUserApplicableMenus(userType: any, menus: any[]): any[] {
    if (isBlank(userType)) return menus; // If userType is blank, return all menus (fallback)

    return menus.filter((menu: any) => {
      // Skip empty objects
      if (Object.keys(menu).length === 0) return false;

      // Recursively filter child menus first
      if (menu.menus && Array.isArray(menu.menus)) {
        menu.menus = this.getUserApplicableMenus(userType, menu.menus);
        return true; // If submenus exist, keep the parent menu
      }

      // Condition 1: If user is Staff and admin access is disabled, remove the menu
      if (userType === UserType.STAFF && menu.isAdminAccessDisabled) {
        return false;
      }

      // Condition 2: If user is not staff and accessAllowedUsers is either empty or does not contain userType, remove the menu
      if (
        userType !== UserType.STAFF &&
        ( // Check if empty OR user not in the list
          !menu.accessAllowedUsers || // Doesn't exist (null/undefined)
          menu.accessAllowedUsers.trim() === "" || // Empty string
          !menu.accessAllowedUsers.split(',').includes(userType) // User not in the list
        )
      ) {
        return false;
      }

      return true;
    });
  }

  showChildSideMenu(): void {
    this.showSideMenu.next('show');
  }

  childMouseEnter(): void {
    this.mouseEnter.next('entered');
  }

  childMouseLeave(): void {
    this.mouseLeave.next('left');
  }

}
