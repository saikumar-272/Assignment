import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrievePersonListComponent} from './retrieve-person-list.component';

describe('RetrievePersonListComponent', () => {
  let component: RetrievePersonListComponent;
  let fixture: ComponentFixture<RetrievePersonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrievePersonListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
