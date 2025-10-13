import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmpLocationListComponent} from './retrieve-emp-location-list.component';

describe('RetrieveEmpLocationListComponent', () => {
  let component: RetrieveEmpLocationListComponent;
  let fixture: ComponentFixture<RetrieveEmpLocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmpLocationListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmpLocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
