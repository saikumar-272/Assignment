import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFacultyComponent} from './retrieve-faculty.component';

describe('RetrieveFacultyComponent', () => {
  let component: RetrieveFacultyComponent;
  let fixture: ComponentFixture<RetrieveFacultyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFacultyComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
