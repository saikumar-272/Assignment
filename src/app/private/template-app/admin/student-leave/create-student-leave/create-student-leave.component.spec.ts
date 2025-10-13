import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateStudentLeaveComponent} from './create-student-leave.component';

describe('CreateStudentLeaveComponent', () => {
  let component: CreateStudentLeaveComponent;
  let fixture: ComponentFixture<CreateStudentLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateStudentLeaveComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudentLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
