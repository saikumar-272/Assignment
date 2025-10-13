import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrievePrivilegeGroupComponent} from './retrieve-privilege-group.component';

describe('RetrievePrivilegeGroupComponent', () => {
  let component: RetrievePrivilegeGroupComponent;
  let fixture: ComponentFixture<RetrievePrivilegeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrievePrivilegeGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePrivilegeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
