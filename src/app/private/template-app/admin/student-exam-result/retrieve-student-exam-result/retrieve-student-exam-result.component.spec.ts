import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentExamResultComponent} from './retrieve-student-exam-result.component';

describe('RetrieveStudentExamResultComponent', () => {
  let component: RetrieveStudentExamResultComponent;
  let fixture: ComponentFixture<RetrieveStudentExamResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentExamResultComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentExamResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
