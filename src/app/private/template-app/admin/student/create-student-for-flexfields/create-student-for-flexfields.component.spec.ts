import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateStudentForFlexfieldsComponent} from './create-student-for-flexfields.component';

describe('CreateStudentForFlexfieldsComponent', () => {
  let component: CreateStudentForFlexfieldsComponent;
  let fixture: ComponentFixture<CreateStudentForFlexfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateStudentForFlexfieldsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudentForFlexfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
