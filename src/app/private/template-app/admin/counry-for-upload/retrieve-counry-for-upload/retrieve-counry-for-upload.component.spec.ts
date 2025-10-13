import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveCounryForUploadComponent} from './retrieve-counry-for-upload.component';

describe('RetrieveCounryForUploadComponent', () => {
  let component: RetrieveCounryForUploadComponent;
  let fixture: ComponentFixture<RetrieveCounryForUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveCounryForUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCounryForUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
