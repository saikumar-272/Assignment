import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStateComponent} from './retrieve-state.component';

describe('RetrieveStateComponent', () => {
  let component: RetrieveStateComponent;
  let fixture: ComponentFixture<RetrieveStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
