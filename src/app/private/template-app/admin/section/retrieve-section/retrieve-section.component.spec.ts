import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSectionComponent} from './retrieve-section.component';

describe('RetrieveSectionComponent', () => {
  let component: RetrieveSectionComponent;
  let fixture: ComponentFixture<RetrieveSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSectionComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
