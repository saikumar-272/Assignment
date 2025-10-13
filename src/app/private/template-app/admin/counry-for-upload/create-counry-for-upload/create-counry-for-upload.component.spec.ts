import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateCounryForUploadComponent} from './create-counry-for-upload.component';

describe('CreateCounryForUploadComponent', () => {
  let component: CreateCounryForUploadComponent;
  let fixture: ComponentFixture<CreateCounryForUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateCounryForUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCounryForUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
