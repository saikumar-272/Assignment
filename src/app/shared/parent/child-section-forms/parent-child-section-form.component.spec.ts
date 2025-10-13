import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParentChildSectionFormComponent} from './parent-child-section-form.component';

describe('ParentChildSectionFormComponent', () => {
  let component: ParentChildSectionFormComponent;
  let fixture: ComponentFixture<ParentChildSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParentChildSectionFormComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentChildSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
