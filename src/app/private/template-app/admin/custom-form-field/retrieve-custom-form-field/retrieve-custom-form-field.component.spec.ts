import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveCustomFormFieldComponent} from './retrieve-custom-form-field.component';

describe('RetrieveCustomFormFieldComponent', () => {
  let component: RetrieveCustomFormFieldComponent;
  let fixture: ComponentFixture<RetrieveCustomFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveCustomFormFieldComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCustomFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
