import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSectionListComponent} from './retrieve-section-list.component';

describe('RetrieveSectionListComponent', () => {
  let component: RetrieveSectionListComponent;
  let fixture: ComponentFixture<RetrieveSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSectionListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
