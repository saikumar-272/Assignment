import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
    RetrieveEmployeeBasicDetailsListSearchPopupComponent
} from './retrieve-employee-basic-details-list-search-popup.component';

describe('RetrieveEmployeeBasicDetailsListSearchPopupComponent', () => {
  let component: RetrieveEmployeeBasicDetailsListSearchPopupComponent;
  let fixture: ComponentFixture<RetrieveEmployeeBasicDetailsListSearchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmployeeBasicDetailsListSearchPopupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmployeeBasicDetailsListSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
