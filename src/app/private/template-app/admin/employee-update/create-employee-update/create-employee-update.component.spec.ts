import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEmployeeUpdateComponent} from './create-employee-update.component';

describe('CreateEmployeeUpdateComponent', () => {
  let component: CreateEmployeeUpdateComponent;
  let fixture: ComponentFixture<CreateEmployeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateEmployeeUpdateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
