import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmployeeComponent} from './retrieve-employee.component';

describe('RetrieveEmployeeComponent', () => {
  let component: RetrieveEmployeeComponent;
  let fixture: ComponentFixture<RetrieveEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmployeeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
