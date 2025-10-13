import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveUploadPersonListComponent} from './retrieve-upload-person-list.component';

describe('RetrieveUploadPersonListComponent', () => {
  let component: RetrieveUploadPersonListComponent;
  let fixture: ComponentFixture<RetrieveUploadPersonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveUploadPersonListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUploadPersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
