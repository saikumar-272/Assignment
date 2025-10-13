import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveMaleGenderStudentsComponent} from './retrieve-male-gender-students.component';

describe('RetrieveMaleGenderStudentsComponent', () => {
  let component: RetrieveMaleGenderStudentsComponent;
  let fixture: ComponentFixture<RetrieveMaleGenderStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveMaleGenderStudentsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveMaleGenderStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
