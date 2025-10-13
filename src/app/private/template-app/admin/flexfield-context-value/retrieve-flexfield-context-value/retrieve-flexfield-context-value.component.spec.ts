import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFlexfieldContextValueComponent} from './retrieve-flexfield-context-value.component';

describe('RetrieveFlexfieldContextValueComponent', () => {
  let component: RetrieveFlexfieldContextValueComponent;
  let fixture: ComponentFixture<RetrieveFlexfieldContextValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFlexfieldContextValueComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFlexfieldContextValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
