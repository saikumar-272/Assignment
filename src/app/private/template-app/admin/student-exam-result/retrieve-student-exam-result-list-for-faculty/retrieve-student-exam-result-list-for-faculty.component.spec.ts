import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
    RetrieveStudentExamResultListForFacultyComponent
} from './retrieve-student-exam-result-list-for-faculty.component';

describe('RetrieveStudentExamResultListForFacultyComponent', () => {
  let component: RetrieveStudentExamResultListForFacultyComponent;
  let fixture: ComponentFixture<RetrieveStudentExamResultListForFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentExamResultListForFacultyComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentExamResultListForFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
