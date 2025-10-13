import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveOrganisationComponent} from './retrieve-organisation.component';

describe('RetrieveOrganisationComponent', () => {
  let component: RetrieveOrganisationComponent;
  let fixture: ComponentFixture<RetrieveOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveOrganisationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
