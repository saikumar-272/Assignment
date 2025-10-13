import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DynamicFieldDisplayComponent} from './dynamic-field-display.component';

describe('DynamicFieldDisplayComponent', () => {
  let component: DynamicFieldDisplayComponent;
  let fixture: ComponentFixture<DynamicFieldDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DynamicFieldDisplayComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFieldDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
