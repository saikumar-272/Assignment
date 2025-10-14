import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,} from "@angular/core";
import {BackendService} from "src/app/shared/services/backend.service";
import {HttpClient} from "@angular/common/http";
import {Observable, of, Subject} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap,} from "rxjs/operators";
import {isBlank} from "src/app/shared/util/string-util";
import {NgSelectModule} from "@ng-select/ng-select";

/*
Purpose of imports
• FormsModule : to use ngModel.
• debounceTime and distinctUntilChanged : to prevent excessive API calls.
*/

@Component({
selector: "app-parent-child-section-form",
  templateUrl: "./parent-child-section-form.component.html",
  imports: [CommonModule, FormsModule, NgSelectModule, ReactiveFormsModule],
  styleUrls: ["./parent-child-section-form.component.scss"],
  standalone: true
})
export class ParentChildSectionFormComponent implements OnInit, OnChanges {
  @Output() openSearchPopup = new EventEmitter<any>();
  @Input() childSectionRowFieldsCount: number = 2;
  @Input() childSectionData: any = {};
  @Input() childSectionFields: any = [];
  @Input() childSectionSelectOptionsData: any = {};
  @Input() childSectionSearchResponseListObject: any = {};
  @Input() pageComponentReference: any;
  methodMap: any;

  input$ = new Subject<any>();
  items: any[] = [];
  loading: boolean = false;
  childSectionRowsCount: number = 10;

  constructor(
    private http: HttpClient,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.methodMap = this.backendService.getMethodDeclaredMap();
    /*
        • Create a subject to track input changes.
        • Use switchMap to cancel previous requests.
        • Use debounceTime to delay API calls until typing pauses.
        • Use distinctUntilChanged to avoid calling the API if the search term is identical to the previous one.
        • Use tap to set loading flag.
        • Use catchError to handle errors.

        Key points :

        • Debouncing: Using debounceTime prevents the API from being called on every keystroke, improving performance.
        • Error Handling: The catchError operator provides a way to handle API errors gracefully.
        • Loading State: The loading flag provides visual feedback while the API is being called.

        Above approach ensures that the API is called only when the user pauses typing, and that the ng-select dropdown is updated with the results.

        */

    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((event) =>
          this.searchApi(event, this).pipe(catchError(() => of([])))
        ),
        tap(() => (this.loading = false))
      )
      .subscribe((event: any) => {});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["childSectionFields"]) {
      const newFields = changes["childSectionFields"].currentValue;
      if (newFields && newFields.length > 0) {
        this.updateRowNumber(newFields);
        this.updateGridColumnCount(newFields);
        this.childSectionRowsCount = this.getMaxRowNumber(newFields);
      }
    }
  }

  searchApi(event: any, componentReference: any): Observable<any[]> {
    var term = event.event.term;
    var fieldInfo = event.fieldInfo;
    var lookupApiName = fieldInfo.lookupApiName;
    fieldInfo["objectReference"] = this.pageComponentReference;
    var searchPayload = { inputText: term, fieldConfig: fieldInfo };
    var responseItemsList = this.methodMap[lookupApiName].bind(
      this.backendService
    )(searchPayload);
    componentReference.childSectionSearchResponseListObject[fieldInfo.key] =
      responseItemsList;
    return responseItemsList;
  }

  openSearchPopupInParent(event: any): void {
    this.openSearchPopup.next(event);
  }

  onChangeForCombo(event: any, fieldInfo: any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.pageComponentReference.onLookupValueSelected(
      selectedValue,
      fieldInfo,
      { value: selectedValue }
    );
  }

  onChangeForBoolean(event: any, fieldInfo: any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.pageComponentReference.onLookupValueSelected(
      selectedValue,
      fieldInfo,
      { value: selectedValue }
    );
  }

  onChangeForLookup(selectedRecord: any, fieldInfo: any) {
    this.pageComponentReference.onLookupValueSelected(
      selectedRecord.id,
      fieldInfo,
      selectedRecord
    );
  }

  /**
   * Called when the user selects a file
   */
  onFileSelected(event: Event, fieldKeyName: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // ✅ Assign directly to your data object
      this.childSectionData[fieldKeyName] = file;
    }
  }

  /**
   * Handles user input.
   * Converts the ISO 8601 datetime string (e.g., "2025-06-05T15:30")
   * to a SQL-compatible format:
   *   - With seconds: "YYYY-MM-DD HH:mm:ss"
   *   - Without seconds: "YYYY-MM-DD HH:mm"
   * Then updates the data model with the formatted value.
   */
  onDateTimeInput(event: Event, key: string, includeSeconds?: boolean): void {
    const input = event.target as HTMLInputElement;
    const isoValue = input?.value || "";

    if (!isoValue) {
      this.childSectionData[key] = null;
      return;
    }

    const date = new Date(isoValue);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0"); // months: 1–12 → "01"–"12"
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = includeSeconds
      ? `${yyyy}-${MM}-${dd} ${hh}:${mm}:${String(date.getSeconds()).padStart(
          2,
          "0"
        )}`
      : `${yyyy}-${MM}-${dd} ${hh}:${mm}`;

    this.childSectionData[key] = formattedDate;
  }

  /**
   * Converts a SQL datetime string (e.g., "2025-06-05 15:30:00")
   * directly to ISO 8601 format for UI display (e.g., "2025-06-05T15:30"),
   * without applying any timezone offset.
   */
  convertSqlToIsoLocal(sqlDateTime: string): string {
    if (!sqlDateTime) return "";
    return sqlDateTime.replace(" ", "T").slice(0, 16);
  }

  getMaxRowNumber(childSectionFields: any[]): number {
    return Math.max(
      0,
      ...childSectionFields.map((field) => Number(field.rowNumber) || 0)
    );
  }

  updateRowNumber(childSectionFields: any[]) {
    let lastRowNumber = 0;

    // Step 1 : Find the last defined rowNumber
    for (let i = 0; i < childSectionFields.length; i++) {
      const sectionField = childSectionFields[i];
      if (!isBlank(sectionField.rowNumber)) {
        lastRowNumber = sectionField.rowNumber;
      } else {
        break;
      }
    }

    // Step 2 : Assign rowNumbers for remaining fields
    let fieldCounter = 0;
    for (let i = 0; i < childSectionFields.length; i++) {
      const sectionField = childSectionFields[i];
      if (isBlank(sectionField.rowNumber)) {
        fieldCounter++;
        const derivedRowNumber =
          lastRowNumber +
          Math.floor((fieldCounter - 1) / this.childSectionRowFieldsCount) +
          1;
        sectionField.rowNumber = derivedRowNumber;
      }
    }
  }

  updateGridColumnCount(childSectionFields: any[]) {
    let derivedGridColumnCount = Math.floor(
      12 / this.childSectionRowFieldsCount
    );
    for (let i = 0; i < childSectionFields.length; i++) {
      let sectionField = childSectionFields[i];
      if (isBlank(sectionField.gridColumnsCount)) {
        sectionField.gridColumnsCount = derivedGridColumnCount;
      }
    }
  }
}
