import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFlexFieldComponent} from './retrieve-flex-field.component';

describe('RetrieveFlexFieldComponent', () => {
  let component: RetrieveFlexFieldComponent;
  let fixture: ComponentFixture<RetrieveFlexFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFlexFieldComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFlexFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
