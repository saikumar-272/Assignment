import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentLeaveListComponent} from './retrieve-student-leave-list.component';

describe('RetrieveStudentLeaveListComponent', () => {
  let component: RetrieveStudentLeaveListComponent;
  let fixture: ComponentFixture<RetrieveStudentLeaveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentLeaveListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
