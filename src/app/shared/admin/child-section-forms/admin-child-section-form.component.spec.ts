import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminChildSectionFormComponent} from './admin-child-section-form.component';

describe('AdminChildSectionFormComponent', () => {
  let component: AdminChildSectionFormComponent;
  let fixture: ComponentFixture<AdminChildSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminChildSectionFormComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChildSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
