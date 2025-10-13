import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmpLocationComponent} from './retrieve-emp-location.component';

describe('RetrieveEmpLocationComponent', () => {
  let component: RetrieveEmpLocationComponent;
  let fixture: ComponentFixture<RetrieveEmpLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmpLocationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmpLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
