import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentListComponent} from './retrieve-student-list.component';

describe('RetrieveStudentListComponent', () => {
  let component: RetrieveStudentListComponent;
  let fixture: ComponentFixture<RetrieveStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
