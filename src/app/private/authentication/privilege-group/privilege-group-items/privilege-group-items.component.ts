import {FormBuilder, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
    IResponseMessage,
    PrivilegeGroupItemDataObject,
    RetrieveListResponseModel,
} from "src/app/shared/interfaces/dto/dto-base";


import {
    retrievePrivilegeGroupItemListSearchFilter
} from "src/app/shared/interfaces/dto/template-app/privilege-group-item/retrieve-privilege-group-item-list";
import {
    IUpdatePrivilegeGroupItemsRequestModel
} from "src/app/shared/interfaces/dto/template-app/privilege-group/update-privilege-group-items";

import PrivilegeGroup from "./PrivilegeGroup.json";

import {ToastNotificationService} from "src/app/toast-notification-service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {CustomisationService} from "src/app/customisation.service";
import {AuthenticationService} from "src/app/shared/services/authentication.service";

@Component({
selector: "app-privilege-group-items",
  imports: [FormsModule, CommonModule, NgbModule],
  templateUrl: "./privilege-group-items.component.html",
  styleUrls: ["./privilege-group-items.component.scss"],
  standalone: true
})
export class PrivilegeGroupItemsComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  id: string = "";
  serviceList: any = [];
  allServicesCheckBox: boolean = false;

  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private route: Router,
    private currentRoute: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    super();
    this.currentRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.id && this.id.length > 0) {
      this.loadPrivilegeList();
    }
  }

  loadPrivilegeList() {
    this.sortAndLoadPrivilegeList(PrivilegeGroup);
  }

  sortAndLoadPrivilegeList(privilegeList: any) {
    let sortedServiceList = privilegeList
      .filter((serviceInfo: any) => serviceInfo.hasOwnProperty("name"))
      .map((serviceInfo: any) => {
        let privilegeGroups = serviceInfo.privilegeGroups
          .filter((privilegeGroup: any) =>
            privilegeGroup.hasOwnProperty("name")
          )
          .map((privilegeGroup: any) => {
            let privilegeGroupItems = privilegeGroup.privilegeGroupItems
              .filter((privilegeGroup: any) =>
                privilegeGroup.hasOwnProperty("name")
              )
              .sort((a: any, b: any) =>
                a.description.localeCompare(b.description)
              );
            privilegeGroup.privilegeGroupItems = privilegeGroupItems;
            return privilegeGroup;
          })
          .filter(
            (privilegeGroup: any) =>
              privilegeGroup.privilegeGroupItems.length > 0
          )
          .sort((a: any, b: any) => a.description.localeCompare(b.description));
        serviceInfo.privilegeGroups = privilegeGroups;
        return serviceInfo;
      })
      .sort((a: any, b: any) => a.description.localeCompare(b.description));
    this.serviceList = sortedServiceList;
    this.loadPrivilegeGroupItems();
  }
  async loadPrivilegeGroupItems() {
    var searchFilter: retrievePrivilegeGroupItemListSearchFilter = <
      retrievePrivilegeGroupItemListSearchFilter
    >{};
    searchFilter.privilegeGroupUUID = this.id;
    searchFilter.pageSize = 10000;
    searchFilter.pageNumber = 0;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrievePrivilegeGroupItemList(searchFilter)
    );
    const privilegeGroupItems = searchResponse.list.map(
      (item: any) => item.name
    );
    this.serviceList = this.serviceList.map((serviceInfo: any) => {
      if (serviceInfo.privilegeGroups?.length > 0) {
        serviceInfo.privilegeGroups = serviceInfo.privilegeGroups.map(
          (privilegeGroup: any) => {
            privilegeGroup.privilegeGroupItems =
              privilegeGroup.privilegeGroupItems.map(
                (privilegeGroupItem: any) => {
                  privilegeGroupItem.checked = privilegeGroupItems.includes(
                    privilegeGroupItem.name
                  );
                  return privilegeGroupItem;
                }
              );
            privilegeGroup.checked =
              privilegeGroup.privilegeGroupItems?.length ===
              privilegeGroup.privilegeGroupItems?.filter(
                (privilege: any) => privilege.checked
              )?.length;
            return privilegeGroup;
          }
        );
      }
      serviceInfo.checked =
        serviceInfo.privilegeGroups?.length ===
        serviceInfo.privilegeGroups?.filter(
          (privilegeGroup: any) => privilegeGroup.checked
        )?.length;
      return serviceInfo;
    });
    this.allServicesCheckBox =
      this.serviceList?.length ===
      this.serviceList?.filter((serviceInfo: any) => serviceInfo.checked)
        ?.length;
  }

  async updateUserRolePrivileges() {
    const privilegeGroupItemList: Array<PrivilegeGroupItemDataObject> = [];
    for (let serviceInfo of this.serviceList) {
      for (let privilegeGroup of serviceInfo.privilegeGroups) {
        let checkedItems =
          privilegeGroup.privilegeGroupItems?.filter(
            (privilegeGroupItem: any) => privilegeGroupItem.checked
          ) || [];
        privilegeGroupItemList.push(...checkedItems);
      }
    }
    const requestModel: IUpdatePrivilegeGroupItemsRequestModel = {
      privilegeGroupUUID: this.id,
      privilegeGroupItemList: privilegeGroupItemList,
    };
    const responseMessage: IResponseMessage =
      await this.backendService.updatePrivilegeGroupItems(requestModel);
    alert(responseMessage.alert);
  }

  toggleAllServicesSelectionCheckbox() {
    setTimeout(() => {
      this.serviceList = this.serviceList?.map((serviceInfo: any) => {
        serviceInfo.checked = this.allServicesCheckBox;
        this.toggleServicePrivilegeGroupsSelectionCheckbox(serviceInfo);
        return serviceInfo;
      });
    }, 100);
  }

  toggleServicePrivilegeGroupsSelectionCheckbox(serviceInfo: any) {
    setTimeout(() => {
      serviceInfo.privilegeGroups = serviceInfo.privilegeGroups?.map(
        (privilegeGroup: any) => {
          privilegeGroup.checked = serviceInfo.checked;
          this.togglePrivilegeGroupSelectionCheckbox(
            privilegeGroup,
            serviceInfo
          );
          return privilegeGroup;
        }
      );
    }, 100);
  }

  togglePrivilegeGroupSelectionCheckbox(privilegeGroup: any, serviceInfo: any) {
    setTimeout(() => {
      privilegeGroup.privilegeGroupItems =
        privilegeGroup.privilegeGroupItems?.map((privilegeGroupItem: any) => {
          privilegeGroupItem.checked = privilegeGroup.checked;
          return privilegeGroupItem;
        });
      this.toggleParentSelectionCheckBox(serviceInfo, privilegeGroup);
    }, 100);
  }

  togglePrivilegeGroupItemSelectionCheckbox(
    privilegeGroup: any,
    serviceInfo: any
  ) {
    setTimeout(() => {
      this.toggleParentSelectionCheckBox(serviceInfo, privilegeGroup);
    }, 100);
  }

  toggleParentSelectionCheckBox(serviceInfo: any, privilegeGroup: any) {
    privilegeGroup.checked =
      privilegeGroup.privilegeGroupItems?.length ===
      privilegeGroup.privilegeGroupItems?.filter(
        (privilege: any) => privilege.checked
      )?.length;
    serviceInfo.checked =
      serviceInfo.privilegeGroups?.length ===
      serviceInfo.privilegeGroups?.filter(
        (privilegeGroup: any) => privilegeGroup.checked
      )?.length;
    this.allServicesCheckBox =
      this.serviceList?.length ===
      this.serviceList?.filter((serviceInfo: any) => serviceInfo.checked)
        ?.length;
  }
}
