import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveCounryForUploadListComponent} from './retrieve-counry-for-upload-list.component';

describe('RetrieveCounryForUploadListComponent', () => {
  let component: RetrieveCounryForUploadListComponent;
  let fixture: ComponentFixture<RetrieveCounryForUploadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveCounryForUploadListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCounryForUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
