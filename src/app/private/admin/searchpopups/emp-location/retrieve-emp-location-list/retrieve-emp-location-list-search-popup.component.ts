import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";

import {
  retrieveEmpLocationListDataObject,
  retrieveEmpLocationListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/emp-location/retrieve-emp-location-list";
import { BackendServiceTemplateApp } from "src/app/shared/services/backend.service.template-app";
import {
  Constants,
  PAGE_SIZE_OPTIONS,
  YES_NO_OPTIONS,
} from "src/app/shared/util/constants";
import { DropDownOption } from "src/app/shared/interfaces/dropdown_option";
import { RetrieveListResponseModel } from "src/app/shared/interfaces/dto/dto-base";
import { CustomisationService } from "src/app/customisation.service";
import { FormFieldsTemplateAppImplComponent } from "src/app/shared/forms-custom/form-fields-template-app-impl";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { ToastNotificationService } from "src/app/toast-notification-service";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";
import { CommonModule } from "@angular/common";
import { AdminChildSectionFormComponent } from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import { DynamicFieldDisplayComponent } from "src/app/shared/dynamic-field-display/dynamic-field-display.component";

import { NgbModule, NgbPaginationModule, NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "retrieve-emp-location-list-search-popup",
  imports: [
    DynamicFieldDisplayComponent,
    NgbModule,
    CommonModule,
    AdminChildSectionFormComponent,
    NgbPaginationModule,
  ],
  templateUrl: "./retrieve-emp-location-list-search-popup.component.html",
  styleUrls: ["./retrieve-emp-location-list-search-popup.component.scss"],
  standalone: true,
})
export class RetrieveEmpLocationListSearchPopupComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  retrieveEmpLocationListSectionFields: any = [];
  retrieveEmpLocationListSectionData: any = {};
  retrieveEmpLocationListSelectOptionsData: any = {};

  @ViewChild("retrieveEmpLocationListSearchPopup")
  private retrieveEmpLocationListSearchPopup!: TemplateRef<any>;
  retrieveEmpLocationListSearchPopupReference!: NgbModalRef;

  @Output("retrieveEmpLocationListSearchPopupParentMethodRef")
  retrieveEmpLocationListSearchPopupParentMethodRef: EventEmitter<any> =
    new EventEmitter();

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveEmpLocationListSearchFilter = <
    retrieveEmpLocationListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveEmpLocationListDataObject[]> = new Map<
    number,
    retrieveEmpLocationListDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  locationTypeOptions: DropDownOption[];

  yesNoOptions = YES_NO_OPTIONS;
  retrieveEmpLocationListTableColumns: Array<any> = [];
  processingSectionName: string = "";
  processingFieldName: string = "";

  constructor(
    private toastNotificationService: ToastNotificationService,
    private backendService: BackendServiceTemplateApp,
    private route: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private customisationService: CustomisationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    super();

    this.locationTypeOptions = [
      { id: "Rural", value: "Rural" },
      { id: "Urban", value: "Urban" },
    ];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;

    //Load table columns
    let retrieveEmpLocationListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveEmpLocationList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveEmpLocationListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveEmpLocationList",
        retrieveEmpLocationListResponseParamList,
        this
      );
    //Load page fields
    let retrieveEmpLocationListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveEmpLocationList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveEmpLocationListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveEmpLocationList",
        retrieveEmpLocationListRequestParamList,
        this
      );
  }

  async resetSearchCriteria() {
    this.retrieveEmpLocationListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchFilter.locationName =
      this.retrieveEmpLocationListSectionData["locationName"];
    this.searchFilter.locationType =
      this.retrieveEmpLocationListSectionData["locationType"];
    this.searchFilter.enableLocationNameUpdate =
      this.retrieveEmpLocationListSectionData["enableLocationNameUpdate"];
    this.searchFilter.description =
      this.retrieveEmpLocationListSectionData["description"];
    this.searchFilter.excludeColumnTest =
      this.retrieveEmpLocationListSectionData["excludeColumnTest"];
    this.fetchEmpLocationList();
  }

  async handleEmpLocationListPageChange(): Promise<void> {
    this.fetchEmpLocationList();
  }

  async fetchEmpLocationList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveEmpLocationList(this.searchFilter)
    );
    if (searchResponse.success == 0) {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }
    this.searchResultObjectsList = searchResponse.list;
    this.collectionSize = searchResponse.matchingSearchResultsCount;
    this.noOfPages = searchResponse.totalPages;
    this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
  }

  showRetrieveEmpLocationListSearchPopup(
    sectionName: string,
    fieldName: string
  ) {
    this.processingSectionName = sectionName;
    this.processingFieldName = fieldName;
    this.retrieveEmpLocationListSearchPopupReference = this.modalService.open(
      this.retrieveEmpLocationListSearchPopup,
      { modalDialogClass: "modal-dialog" }
    );
    this.retrieveEmpLocationListSearchPopupReference.result.then(
      async (result) => {},
      (reason) => {}
    );
  }

  setSelectedValue(searchResultObject: any) {
    let processingLookupInfo: any = {
      id: searchResultObject["empLocationUUID"],
      displayText: searchResultObject["locationName"],
      processingSectionName: this.processingSectionName,
      processingFieldName: this.processingFieldName,
    };
    this.retrieveEmpLocationListSearchPopupParentMethodRef.emit(
      processingLookupInfo
    );
    this.retrieveEmpLocationListSearchPopupReference.close();
  }

  async onLookupValueSelected(selectedValue: any, field: any) {}

  updateSelectOptionsData() {
    this.retrieveEmpLocationListSelectOptionsData["locationType"] =
      OptionsList.LocationType;
  }
}
