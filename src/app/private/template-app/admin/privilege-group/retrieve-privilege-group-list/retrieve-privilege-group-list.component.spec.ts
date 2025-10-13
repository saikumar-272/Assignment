import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrievePrivilegeGroupListComponent} from './retrieve-privilege-group-list.component';

describe('RetrievePrivilegeGroupListComponent', () => {
  let component: RetrievePrivilegeGroupListComponent;
  let fixture: ComponentFixture<RetrievePrivilegeGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrievePrivilegeGroupListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePrivilegeGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
