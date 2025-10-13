import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFacultyListSearchPopupComponent} from './retrieve-faculty-list-search-popup.component';

describe('RetrieveFacultyListSearchPopupComponent', () => {
  let component: RetrieveFacultyListSearchPopupComponent;
  let fixture: ComponentFixture<RetrieveFacultyListSearchPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFacultyListSearchPopupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFacultyListSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
