import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateOrganisationComponent} from './update-organisation.component';

describe('UpdateOrganisationComponent', () => {
  let component: UpdateOrganisationComponent;
  let fixture: ComponentFixture<UpdateOrganisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateOrganisationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
