import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentLeaveComponent} from './retrieve-student-leave.component';

describe('RetrieveStudentLeaveComponent', () => {
  let component: RetrieveStudentLeaveComponent;
  let fixture: ComponentFixture<RetrieveStudentLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentLeaveComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
