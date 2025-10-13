import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateNewStaffUserComponent} from './create-new-staff-user.component';

describe('CreateNewStaffUserComponent', () => {
  let component: CreateNewStaffUserComponent;
  let fixture: ComponentFixture<CreateNewStaffUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateNewStaffUserComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewStaffUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
