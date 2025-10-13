import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentListForFacultyComponent} from './retrieve-student-list-for-faculty.component';

describe('RetrieveStudentListForFacultyComponent', () => {
  let component: RetrieveStudentListForFacultyComponent;
  let fixture: ComponentFixture<RetrieveStudentListForFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentListForFacultyComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentListForFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
