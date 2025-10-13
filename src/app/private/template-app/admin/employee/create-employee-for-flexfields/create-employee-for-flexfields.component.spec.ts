import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEmployeeForFlexfieldsComponent} from './create-employee-for-flexfields.component';

describe('CreateEmployeeForFlexfieldsComponent', () => {
  let component: CreateEmployeeForFlexfieldsComponent;
  let fixture: ComponentFixture<CreateEmployeeForFlexfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateEmployeeForFlexfieldsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployeeForFlexfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
