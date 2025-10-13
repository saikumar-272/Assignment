import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveParentListComponent} from './retrieve-parent-list.component';

describe('RetrieveParentListComponent', () => {
  let component: RetrieveParentListComponent;
  let fixture: ComponentFixture<RetrieveParentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveParentListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveParentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
