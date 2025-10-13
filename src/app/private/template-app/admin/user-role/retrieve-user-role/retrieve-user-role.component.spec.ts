import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveUserRoleComponent} from './retrieve-user-role.component';

describe('RetrieveUserRoleComponent', () => {
  let component: RetrieveUserRoleComponent;
  let fixture: ComponentFixture<RetrieveUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveUserRoleComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
