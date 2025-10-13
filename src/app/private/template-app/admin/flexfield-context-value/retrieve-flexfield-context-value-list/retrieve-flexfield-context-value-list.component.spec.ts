import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFlexfieldContextValueListComponent} from './retrieve-flexfield-context-value-list.component';

describe('RetrieveFlexfieldContextValueListComponent', () => {
  let component: RetrieveFlexfieldContextValueListComponent;
  let fixture: ComponentFixture<RetrieveFlexfieldContextValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFlexfieldContextValueListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFlexfieldContextValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
