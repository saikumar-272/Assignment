import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmployeeListComponent} from './retrieve-employee-list.component';

describe('RetrieveEmployeeListComponent', () => {
  let component: RetrieveEmployeeListComponent;
  let fixture: ComponentFixture<RetrieveEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmployeeListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
