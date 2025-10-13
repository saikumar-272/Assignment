import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStudentComponent} from './retrieve-student.component';

describe('RetrieveStudentComponent', () => {
  let component: RetrieveStudentComponent;
  let fixture: ComponentFixture<RetrieveStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStudentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
