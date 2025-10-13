import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmpLocationListSearchPopupComponent} from './retrieve-emp-location-list-search-popup.component';

describe('RetrieveEmpLocationListSearchPopupComponent', () => {
  let component: RetrieveEmpLocationListSearchPopupComponent;
  let fixture: ComponentFixture<RetrieveEmpLocationListSearchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmpLocationListSearchPopupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmpLocationListSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
