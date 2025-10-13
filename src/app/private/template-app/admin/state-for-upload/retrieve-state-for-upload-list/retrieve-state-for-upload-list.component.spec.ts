import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStateForUploadListComponent} from './retrieve-state-for-upload-list.component';

describe('RetrieveStateForUploadListComponent', () => {
  let component: RetrieveStateForUploadListComponent;
  let fixture: ComponentFixture<RetrieveStateForUploadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStateForUploadListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStateForUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
