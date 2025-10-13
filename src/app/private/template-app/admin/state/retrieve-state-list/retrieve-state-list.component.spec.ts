import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStateListComponent} from './retrieve-state-list.component';

describe('RetrieveStateListComponent', () => {
  let component: RetrieveStateListComponent;
  let fixture: ComponentFixture<RetrieveStateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStateListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
