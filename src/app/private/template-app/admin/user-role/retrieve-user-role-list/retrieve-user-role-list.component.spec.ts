import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveUserRoleListComponent} from './retrieve-user-role-list.component';

describe('RetrieveUserRoleListComponent', () => {
  let component: RetrieveUserRoleListComponent;
  let fixture: ComponentFixture<RetrieveUserRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveUserRoleListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUserRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
