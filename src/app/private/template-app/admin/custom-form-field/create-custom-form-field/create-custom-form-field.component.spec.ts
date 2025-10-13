import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateCustomFormFieldComponent} from './create-custom-form-field.component';

describe('CreateCustomFormFieldComponent', () => {
  let component: CreateCustomFormFieldComponent;
  let fixture: ComponentFixture<CreateCustomFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateCustomFormFieldComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
