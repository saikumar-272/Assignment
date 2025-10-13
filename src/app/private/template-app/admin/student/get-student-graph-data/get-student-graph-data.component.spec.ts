import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GetStudentGraphDataComponent} from './get-student-graph-data.component';

describe('GetStudentGraphDataComponent', () => {
  let component: GetStudentGraphDataComponent;
  let fixture: ComponentFixture<GetStudentGraphDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GetStudentGraphDataComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStudentGraphDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
