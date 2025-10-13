import {DynamicFieldDisplayComponent} from "src/app/shared/dynamic-field-display/dynamic-field-display.component";
import {
    AdminChildSectionFormComponent
} from "src/app/shared/admin/child-section-forms/admin-child-section-form.component";
import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {
    retrieveFlexfieldContextValueListDataObject,
    retrieveFlexfieldContextValueListSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/flexfield-context-value/retrieve-flexfield-context-value-list";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {RetrieveListResponseModel} from "src/app/shared/interfaces/dto/dto-base";


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsTemplateAppImplComponent} from "src/app/shared/forms-custom/form-fields-template-app-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";

import { NgbModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
selector: "app-retrieve-flexfield-context-value-list",
  templateUrl: "./retrieve-flexfield-context-value-list.component.html",
  styleUrls: ["./retrieve-flexfield-context-value-list.component.scss"],
  imports: [NgbModule, CommonModule, RouterModule, AdminChildSectionFormComponent, DynamicFieldDisplayComponent, NgbPaginationModule],
  standalone: true
})
export class RetrieveFlexfieldContextValueListComponent
  extends FormFieldsTemplateAppImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];
  retrieveFlexfieldContextValueListSectionFields: any = [];
  retrieveFlexfieldContextValueListSectionData: any = {};
  retrieveFlexfieldContextValueListSelectOptionsData: any = {};

  selectedFlexfieldContextValueUUID: string = "";

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: retrieveFlexfieldContextValueListSearchFilter = <
    retrieveFlexfieldContextValueListSearchFilter
  >{};
  pageResultsMap: Map<number, retrieveFlexfieldContextValueListDataObject[]> =
    new Map<number, retrieveFlexfieldContextValueListDataObject[]>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  retrieveFlexfieldContextValueList_flexfieldList: any[];
  selected_retrieveFlexfieldContextValueList_flexfieldUUID: string;

  yesNoOptions = YES_NO_OPTIONS;
  retrieveFlexfieldContextValueListTableColumns: Array<any> = [];
  isPaginationInitialized = false;

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
    this.retrieveFlexfieldContextValueList_flexfieldList = [];
    this.selected_retrieveFlexfieldContextValueList_flexfieldUUID = "";
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom(
      "RetrieveFlexfieldContextValueList"
    );
    /**
     * <ngb-pagination> component (pageChange) event is fired onload, so need not trigger search() explicitly here.
     */

    //Load table columns
    let retrieveFlexfieldContextValueListResponseParamList =
      await this.getApiResponseParameterListCustom(
        "retrieveFlexfieldContextValueList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveFlexfieldContextValueListTableColumns =
      this.getListApiTableColumnListCustom(
        "retrieveFlexfieldContextValueList",
        retrieveFlexfieldContextValueListResponseParamList,
        this
      );
    //Load page fields
    let retrieveFlexfieldContextValueListRequestParamList =
      await this.getApiRequestParameterListCustom(
        "retrieveFlexfieldContextValueList",
        this.backendService,
        this.toastNotificationService
      );
    this.retrieveFlexfieldContextValueListSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "retrieveFlexfieldContextValueList",
        retrieveFlexfieldContextValueListRequestParamList,
        this
      );

    this.setDataToFormOnload(
      "retrieveFlexfieldContextValueList",
      this.router,
      this.currentRoute,
      this
    );
    this.onPageInit(
      "retrieveFlexfieldContextValueList",
      this.currentRoute,
      this,
      ["retrieveFlexfieldContextValueListSC"]
    );
  }

  async resetSearchCriteria() {
    this.retrieveFlexfieldContextValueListSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchResultObjectsList = [];
    if (!this.populateSearchFilterFromForm()) {
      return;
    }
    this.fetchFlexfieldContextValueList();
  }

  populateSearchFilterFromForm() {
    this.pageResultsMap.clear();
    this.searchFilter.code =
      this.retrieveFlexfieldContextValueListSectionData["code"];
    this.searchFilter.flexfieldUUID =
      this.retrieveFlexfieldContextValueListSectionData["flexfieldUUID"];
    this.searchFilter.displayValue =
      this.retrieveFlexfieldContextValueListSectionData["displayValue"];
    let numberFieldList: any[] = [];
    let numberValidationErrorMessage = this.validateNumberFieldInputValue(
      numberFieldList,
      this.searchFilter
    );
    if (numberValidationErrorMessage.length > 0) {
      this.toastNotificationService.showError(
        numberValidationErrorMessage,
        "Enter correct number for below fields."
      );
      return false;
    }
    return true;
  }

  async handleFlexfieldContextValueListPageChange(): Promise<void> {
    // Skip the first auto-triggered page change on load
    if (!this.isPaginationInitialized) {
      this.isPaginationInitialized = true;
      return;
    }
    if (!this.populateSearchFilterFromForm()) {
      this.searchResultObjectsList = [];
      this.pageResultsMap.clear();
      return;
    }
    this.fetchFlexfieldContextValueList();
  }

  async fetchFlexfieldContextValueList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    this.searchFilter.pageNumber = this.currentPage;
    this.searchFilter.pageSize = this.pageSize;
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.retrieveFlexfieldContextValueList(
        this.searchFilter
      )
    );
    if (searchResponse.success == 0) {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }
    if (searchResponse.alert) {
      this.toastNotificationService.showSuccess(searchResponse.alert);
    } else {
      this.searchResultObjectsList = searchResponse.list;
      this.collectionSize = searchResponse.matchingSearchResultsCount;
      this.noOfPages = searchResponse.totalPages;
      this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
    }
  }

  executeUserAction(actionName: any, dataObject: any) {
    this.executeUserActionCustom(
      actionName,
      "RetrieveFlexfieldContextValueList",
      this.router,
      dataObject,
      this.backendService,
      this.toastNotificationService
    );
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {}

  updateDisplayPropertyOfAField(
    apiName: string,
    key: string,
    selectedValue: any
  ) {
    this.updateDependentFieldsDisplayProps(apiName, key, selectedValue, this, [
      "retrieveFlexfieldContextValueListSC",
    ]);
  }

  updateSelectOptionsData() {}
}
