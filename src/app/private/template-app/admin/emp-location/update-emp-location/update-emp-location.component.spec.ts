import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateEmpLocationComponent} from './update-emp-location.component';

describe('UpdateEmpLocationComponent', () => {
  let component: UpdateEmpLocationComponent;
  let fixture: ComponentFixture<UpdateEmpLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateEmpLocationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmpLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
