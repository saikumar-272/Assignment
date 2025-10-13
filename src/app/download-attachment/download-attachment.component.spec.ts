import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloadAttachmentComponent} from './download-attachment.component';

describe('DownloadAttachmentComponent', () => {
  let component: DownloadAttachmentComponent;
  let fixture: ComponentFixture<DownloadAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DownloadAttachmentComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
