import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveStateForUploadComponent} from './retrieve-state-for-upload.component';

describe('RetrieveStateForUploadComponent', () => {
  let component: RetrieveStateForUploadComponent;
  let fixture: ComponentFixture<RetrieveStateForUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveStateForUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveStateForUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
