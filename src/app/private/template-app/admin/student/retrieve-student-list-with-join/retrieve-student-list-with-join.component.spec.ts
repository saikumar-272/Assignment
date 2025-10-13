import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentListWithJoinComponent} from './retrieve-student-list-with-join.component';

describe('RetrieveStudentListWithJoinComponent', () => {
  let component: RetrieveStudentListWithJoinComponent;
  let fixture: ComponentFixture<RetrieveStudentListWithJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentListWithJoinComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentListWithJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
