import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateFlexfieldContextValueComponent} from './update-flexfield-context-value.component';

describe('UpdateFlexfieldContextValueComponent', () => {
  let component: UpdateFlexfieldContextValueComponent;
  let fixture: ComponentFixture<UpdateFlexfieldContextValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateFlexfieldContextValueComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFlexfieldContextValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
