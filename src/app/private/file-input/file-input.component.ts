import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-file-input',
  template: '<input type="file" required accept="{{ inputPropAccept }}">',
  styleUrls: ['./file-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileInputComponent,
      multi: true
    }
  ]
})
export class FileInputComponent implements ControlValueAccessor {
  @Input('accept')
  get inputPropAccept(): string { return this._input_prop_accept; }
  set inputPropAccept(prop: string) { this._input_prop_accept = prop; }
  private _input_prop_accept: string = '';

  onChange!: Function;

  @Input() enableResetBtn: boolean = false;
  @Output() onReset: EventEmitter<boolean> = new EventEmitter<boolean>();

  get file() { return this.selectedFile; }
  private selectedFile: File | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.onChange(file);
    this.selectedFile = file;
  }

  constructor( private host: ElementRef<HTMLInputElement> ) {
  }

  writeValue( value: null ) {
    // clear file input
    this.host.nativeElement.value = '';
    this.selectedFile = null;
  }

  registerOnChange( fn: Function ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: Function ) {
  }
}
