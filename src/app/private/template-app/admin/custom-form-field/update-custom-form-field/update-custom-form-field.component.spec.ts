import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateCustomFormFieldComponent} from './update-custom-form-field.component';

describe('UpdateCustomFormFieldComponent', () => {
  let component: UpdateCustomFormFieldComponent;
  let fixture: ComponentFixture<UpdateCustomFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateCustomFormFieldComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
