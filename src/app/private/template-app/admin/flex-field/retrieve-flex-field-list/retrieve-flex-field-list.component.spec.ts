import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFlexFieldListComponent} from './retrieve-flex-field-list.component';

describe('RetrieveFlexFieldListComponent', () => {
  let component: RetrieveFlexFieldListComponent;
  let fixture: ComponentFixture<RetrieveFlexFieldListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFlexFieldListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFlexFieldListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
