import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateStudentExamResultComponent} from './update-student-exam-result.component';

describe('UpdateStudentExamResultComponent', () => {
  let component: UpdateStudentExamResultComponent;
  let fixture: ComponentFixture<UpdateStudentExamResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateStudentExamResultComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudentExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
