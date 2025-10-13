import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserRolePrivilegesComponent} from './user-role-privileges.component';

describe('UserRolePrivilegesComponent', () => {
  let component: UserRolePrivilegesComponent;
  let fixture: ComponentFixture<UserRolePrivilegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UserRolePrivilegesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolePrivilegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
