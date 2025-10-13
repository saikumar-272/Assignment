import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateStudentExamResultComponent} from './create-student-exam-result.component';

describe('CreateStudentExamResultComponent', () => {
  let component: CreateStudentExamResultComponent;
  let fixture: ComponentFixture<CreateStudentExamResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateStudentExamResultComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudentExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
