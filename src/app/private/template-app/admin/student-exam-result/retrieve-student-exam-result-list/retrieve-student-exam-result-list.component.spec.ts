import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentExamResultListComponent} from './retrieve-student-exam-result-list.component';

describe('RetrieveStudentExamResultListComponent', () => {
  let component: RetrieveStudentExamResultListComponent;
  let fixture: ComponentFixture<RetrieveStudentExamResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentExamResultListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentExamResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
