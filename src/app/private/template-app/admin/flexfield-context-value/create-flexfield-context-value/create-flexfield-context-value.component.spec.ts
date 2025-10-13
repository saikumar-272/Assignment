import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateFlexfieldContextValueComponent} from './create-flexfield-context-value.component';

describe('CreateFlexfieldContextValueComponent', () => {
  let component: CreateFlexfieldContextValueComponent;
  let fixture: ComponentFixture<CreateFlexfieldContextValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateFlexfieldContextValueComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFlexfieldContextValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
