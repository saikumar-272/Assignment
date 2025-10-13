import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEmpLocationComponent} from './create-emp-location.component';

describe('CreateEmpLocationComponent', () => {
  let component: CreateEmpLocationComponent;
  let fixture: ComponentFixture<CreateEmpLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateEmpLocationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmpLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
