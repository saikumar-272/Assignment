import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateCounryForUploadComponent} from './update-counry-for-upload.component';

describe('UpdateCounryForUploadComponent', () => {
  let component: UpdateCounryForUploadComponent;
  let fixture: ComponentFixture<UpdateCounryForUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateCounryForUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCounryForUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
