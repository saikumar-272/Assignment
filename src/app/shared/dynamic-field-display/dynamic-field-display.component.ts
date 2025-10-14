import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {BackendService} from "src/app/shared/services/backend.service";
import {HttpClient} from "@angular/common/http";
import {isBlank, isNotBlank} from "src/app/shared/util/string-util";
import {
    convertDBDateTimeToUI as convertDBDateTimeToUIFn,
    convertDBDateTimeWithSecondsToUI as convertDBDateTimeWithSecondsToUIFn,
    convertDBDateToUI as convertDBDateToUIFn,
} from "../util/date-util";
import OptionsList from "src/app/shared/forms-custom/OptionsList.json";

@Component({
  selector: "app-dynamic-field-display",
  standalone: true,
  templateUrl: "./dynamic-field-display.component.html",
  styleUrls: ["./dynamic-field-display.component.scss"],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class DynamicFieldDisplayComponent implements OnInit {
  @Input() pageField: any = {};
  @Input() dataObject: any = {};

  constructor(
    private http: HttpClient,
    private backendService: BackendService
  ) {}

  ngOnInit() {}

  getLookupViewRouterLink(fieldInfo: any, dataObject: any): any {
    const key = fieldInfo.key.replace(/DisplayText$/, "");
    const uuid = dataObject[key + "UUID"];
    return {
      path: fieldInfo.retrievePageUrl,
      queryParams: { id: uuid },
    };
  }

  getLookupViewLink(fieldInfo: any, dataObject: any): string {
    var fieldKeyName = fieldInfo.key;
    var lookupDisplayText = dataObject[fieldKeyName];
    if (isNotBlank(lookupDisplayText)) {
      var fieldKeyName = fieldKeyName.replace(/DisplayText$/, ""); //To remove the suffix 'DisplayText' from the last occurrence
      var lookupUUID = dataObject[fieldKeyName + "UUID"];
      var fullDomain = window.location.origin;
      var lookupViewPageUrl =
        fullDomain +
        fieldInfo.otherServiceContextPath +
        fieldInfo.retrievePageUrl +
        "?id=" +
        lookupUUID;
      return lookupViewPageUrl;
    }
    return "";
  }

  getSelectedComboDisplayText(value: string, optionsListName: string): string {
    if (isBlank(value) || isBlank(optionsListName)) {
      return "";
    }
    const options = OptionsList[optionsListName];
    if (!Array.isArray(options)) {
      return "";
    }
    const match = options.find((option) => option.id === value);
    return match?.value || "";
  }

  getNumberWithCommaSeparated(value: number | string): string {
    const num = Number(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-IN"); // Change locale as needed
  }

  convertDBDateToUI(dateValue: string): string {
    return convertDBDateToUIFn(dateValue);
  }

  convertDBDateTimeToUI(dateValue: string): string {
    return convertDBDateTimeToUIFn(dateValue);
  }

  convertDBDateTimeWithSecondsToUI(dateValue: string): string {
    return convertDBDateTimeWithSecondsToUIFn(dateValue);
  }

  isValueNotBlank(value: string): boolean {
    return isNotBlank(value);
  }
}
