import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmployeeListSearchPopupComponent} from './retrieve-employee-list-search-popup.component';

describe('RetrieveEmployeeListSearchPopupComponent', () => {
  let component: RetrieveEmployeeListSearchPopupComponent;
  let fixture: ComponentFixture<RetrieveEmployeeListSearchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmployeeListSearchPopupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmployeeListSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
