import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateFlexFieldComponent} from './update-flex-field.component';

describe('UpdateFlexFieldComponent', () => {
  let component: UpdateFlexFieldComponent;
  let fixture: ComponentFixture<UpdateFlexFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateFlexFieldComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFlexFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
