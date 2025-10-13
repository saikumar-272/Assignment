import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdatePrivilegeGroupComponent} from './update-privilege-group.component';

describe('UpdatePrivilegeGroupComponent', () => {
  let component: UpdatePrivilegeGroupComponent;
  let fixture: ComponentFixture<UpdatePrivilegeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdatePrivilegeGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePrivilegeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
