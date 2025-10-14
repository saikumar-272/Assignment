import {Component, EventEmitter, Output, TemplateRef, ViewChild,} from "@angular/core";
import {AngularEditorConfig, AngularEditorModule} from "@kolkov/angular-editor";
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormFieldsImplComponent} from "src/app/shared/forms-custom/form-fields-impl";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";

@Component({
selector: "angular-editor-popup",
  imports: [AngularEditorModule, FormsModule, CommonModule, NgbModule, ReactiveFormsModule],
  template: `
    <ng-template #angularEditorPopup let-modal>
      <angular-editor
        id="editor1"
        [(ngModel)]="editorText"
        [config]="config"
      ></angular-editor>
      <button
        *ngIf="showSaveButton"
        class="btn btn-outline-secondary"
        type="button"
        (click)="saveAngularEditorData()"
      >
        Save
      </button>
    </ng-template>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `],
  standalone: true
})
export class RichTextEditorComponent extends FormFieldsImplComponent {
  @ViewChild("angularEditorPopup")
  private angularEditorPopup!: TemplateRef<any>;
  angularEditorPopupReference!: NgbModalRef;

  @Output("angularEditorPopupParentMethodRef")
  angularEditorPopupParentMethodRef: EventEmitter<any> = new EventEmitter();

  processingSectionName: string = "";
  processingFieldName: string = "";
  showSaveButton = true;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: "20rem",
    maxHeight: "20rem",
    placeholder: "Enter text here...",
    translate: "no",
    sanitize: false,
    toolbarPosition: "top",
    defaultFontName: "Arial",
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      }],
  };
  editorText: any;

  constructor(private modalService: NgbModal) {
    super();
  }

  showAngularEditorPopup(
    sectionName: string,
    fieldName: string,
    editorInputData: string,
    editable: boolean
  ) {
    if (editorInputData == null) {
      editorInputData = "";
    }
    this.showSaveButton = editable;
    this.config.editable = editable;
    this.editorText = editorInputData;
    this.processingSectionName = sectionName;
    this.processingFieldName = fieldName;
    this.angularEditorPopupReference = this.modalService.open(
      this.angularEditorPopup,
      {}
    );
  }
  saveAngularEditorData() {
    let processingLookupInfo: any = {
      editorInputData: this.editorText,
      processingSectionName: this.processingSectionName,
      processingFieldName: this.processingFieldName,
    };
    this.angularEditorPopupParentMethodRef.emit(processingLookupInfo);
    this.angularEditorPopupReference.close();
  }
}
