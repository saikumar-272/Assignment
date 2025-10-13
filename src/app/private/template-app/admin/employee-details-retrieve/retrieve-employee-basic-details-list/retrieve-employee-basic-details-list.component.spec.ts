import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmployeeBasicDetailsListComponent} from './retrieve-employee-basic-details-list.component';

describe('RetrieveEmployeeBasicDetailsListComponent', () => {
  let component: RetrieveEmployeeBasicDetailsListComponent;
  let fixture: ComponentFixture<RetrieveEmployeeBasicDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmployeeBasicDetailsListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmployeeBasicDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
