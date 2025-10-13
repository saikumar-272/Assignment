import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GetApiCustomFormFieldListComponent} from './get-api-custom-form-field-list.component';

describe('GetApiCustomFormFieldListComponent', () => {
  let component: GetApiCustomFormFieldListComponent;
  let fixture: ComponentFixture<GetApiCustomFormFieldListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GetApiCustomFormFieldListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetApiCustomFormFieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
