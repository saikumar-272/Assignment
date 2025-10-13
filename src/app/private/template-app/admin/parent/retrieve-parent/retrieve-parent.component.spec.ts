import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveParentComponent} from './retrieve-parent.component';

describe('RetrieveParentComponent', () => {
  let component: RetrieveParentComponent;
  let fixture: ComponentFixture<RetrieveParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveParentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
