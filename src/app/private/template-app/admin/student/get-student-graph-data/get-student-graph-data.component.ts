import {
    AdminChildSectionFormComponent
} from 'src/app/shared/admin/child-section-forms/admin-child-section-form.component';
import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {
    getStudentGraphDataDataObject,
    getStudentGraphDataSearchFilter,
} from "src/app/shared/interfaces/dto/template-app/student/get-student-graph-data";
import {BackendServiceTemplateApp} from "src/app/shared/services/backend.service.template-app";
import {Constants, PAGE_SIZE_OPTIONS, YES_NO_OPTIONS,} from "src/app/shared/util/constants";
import {DropDownOption} from "src/app/shared/interfaces/dropdown_option";
import {RetrieveListResponseModel,} from "src/app/shared/interfaces/dto/dto-base";
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import {CustomisationService} from "src/app/customisation.service";
import {FormFieldsImplComponent} from "src/app/shared/forms-custom/form-fields-impl";
import {AuthenticationService} from "src/app/shared/services/authentication.service";
import {ToastNotificationService} from "src/app/toast-notification-service";
import {BarChartComponent} from "src/app/private/graphs/barchart/barchart";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";

@Component({
selector: "app-get-student-graph-data",
  imports: [CommonModule, AdminChildSectionFormComponent, BarChartComponent, NgbModule],
  templateUrl: "./get-student-graph-data.component.html",
  styleUrls: ["./get-student-graph-data.component.scss"],
  standalone: true
})
export class GetStudentGraphDataComponent
  extends FormFieldsImplComponent
  implements OnInit
{
  pageComponentReference: any;
  userActions: Array<any> = [];

  getStudentGraphDataSectionFields: any = [];
  getStudentGraphDataSectionData: any = {};
  getStudentGraphDataSelectOptionsData: any = {};

  searchResultObjectsList: Array<any> = [];
  collectionSize: number = 0;
  pageSize: number = Constants.DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  noOfPages: number = 0;
  searchFilter: getStudentGraphDataSearchFilter = <
    getStudentGraphDataSearchFilter
  >{};
  pageResultsMap: Map<number, getStudentGraphDataDataObject[]> = new Map<
    number,
    getStudentGraphDataDataObject[]
  >();
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  gradeOptions: DropDownOption[];

  yesNoOptions = YES_NO_OPTIONS;

  @ViewChild(BarChartComponent)
  barChartComponent!: BarChartComponent;

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

    this.gradeOptions = [
      { id: "A", value: "A" },
      { id: "B", value: "B" },
      { id: "C", value: "C" }];
    this.updateSelectOptionsData();
  }
  doesUserHaveAccess(privilegeName: string): boolean {
    return this.authService.doesUserHavePrivilege(privilegeName);
  }
  async ngOnInit(): Promise<void> {
    this.pageComponentReference = this;
    this.userActions = this.getUserActionsCustom("GetStudentGraphData");

    //Load page fields
    let getStudentGraphDataRequestParamList =
      await this.getApiRequestParameterListCustom(
        "getStudentGraphData",
        this.backendService,
        this.toastNotificationService
      );
    this.getStudentGraphDataSectionFields =
      this.getSectionFieldsFromApiRequestParams(
        "getStudentGraphData",
        getStudentGraphDataRequestParamList,
        this
      );
    if (this.getStudentGraphDataSectionFields.length == 0) {
      this.search();
    }
  }

  async resetSearchCriteria() {
    this.getStudentGraphDataSectionData = {};
  }

  async search() {
    this.pageResultsMap.clear();
    this.searchFilter.isPassed =
      this.getStudentGraphDataSectionData["isPassed"];
    this.searchFilter.passMarks =
      this.getStudentGraphDataSectionData["passMarks"];
    this.searchFilter.failMarks =
      this.getStudentGraphDataSectionData["failMarks"];
    this.searchFilter.grade = this.getStudentGraphDataSectionData["grade"];
    this.searchFilter.gradeAMarks =
      this.getStudentGraphDataSectionData["gradeAMarks"];
    this.searchFilter.gradeBMarks =
      this.getStudentGraphDataSectionData["gradeBMarks"];
    this.searchFilter.gradeCMarks =
      this.getStudentGraphDataSectionData["gradeCMarks"];
    this.fetchStudentList();
  }

  async handleStudentListPageChange(): Promise<void> {
    this.fetchStudentList();
  }

  async fetchStudentList() {
    if (this.pageResultsMap.has(this.currentPage)) {
      this.searchResultObjectsList = this.pageResultsMap.get(
        this.currentPage
      ) as [];
      return;
    }
    let searchResponse = <RetrieveListResponseModel>(
      await this.backendService.getStudentGraphData(this.searchFilter)
    );
    if (searchResponse.success == 0) {
      this.toastNotificationService.showError(searchResponse.alert);
      return;
    }
    this.searchResultObjectsList = searchResponse.list;
    this.collectionSize = searchResponse.matchingSearchResultsCount;
    this.noOfPages = searchResponse.totalPages;
    this.pageResultsMap.set(this.currentPage, this.searchResultObjectsList);
    this.renderBargraph();
  }
  renderBargraph() {
    if (this.barChartComponent) {
      let graphHeaderLabel = "Student Graph Data";
      let dataList = this.searchResultObjectsList;
      let mbarChartLabels: string[] = [];
      let ageDataArray: any[] = [];
      for (let data of dataList) {
        mbarChartLabels.push(data.firstName);
        ageDataArray.push(data.age);
      }
      let barChartData: any[] = [{ data: ageDataArray, label: "Age" }];
      this.barChartComponent.callBarchartMethod(
        graphHeaderLabel,
        mbarChartLabels,
        barChartData
      );
    }
  }

  executeUserAction(actionName: any, id: string) {
    this.executeUserActionCustom(
      actionName,
      "RetrievePrivilegeGroupList",
      this.router,
      { id: id }
    );
  }
  async onLookupValueSelected(selectedValue: any, field: any) {
    if (
      true === field.showHideDependentFields ||
      "true" === field.showHideDependentFields
    )
      this.updateDisplayPropertyOfFields(selectedValue, field);
  }
  updateDisplayPropertyOfFields(selectedValue: any, field: any) {
    if (field.apiName === "getStudentGraphData")
      this.updateDependentFieldsDisplayProps(
        field.apiName,
        field.key,
        selectedValue,
        this,
        ["getStudentGraphData"]
      );
  }
  updateSelectOptionsData() {
    this.getStudentGraphDataSelectOptionsData["grade"] = OptionsList.Grade;
  }
}
