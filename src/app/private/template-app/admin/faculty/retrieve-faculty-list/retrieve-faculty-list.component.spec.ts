import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveFacultyListComponent} from './retrieve-faculty-list.component';

describe('RetrieveFacultyListComponent', () => {
  let component: RetrieveFacultyListComponent;
  let fixture: ComponentFixture<RetrieveFacultyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveFacultyListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveFacultyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
