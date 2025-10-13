import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveOrganisationListComponent} from './retrieve-organisation-list.component';

describe('RetrieveOrganisationListComponent', () => {
  let component: RetrieveOrganisationListComponent;
  let fixture: ComponentFixture<RetrieveOrganisationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveOrganisationListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveOrganisationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
