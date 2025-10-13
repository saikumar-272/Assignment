import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateStateForUploadComponent} from './update-state-for-upload.component';

describe('UpdateStateForUploadComponent', () => {
  let component: UpdateStateForUploadComponent;
  let fixture: ComponentFixture<UpdateStateForUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateStateForUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStateForUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
