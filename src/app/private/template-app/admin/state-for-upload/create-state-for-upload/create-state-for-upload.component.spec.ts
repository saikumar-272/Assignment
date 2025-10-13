import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateStateForUploadComponent} from './create-state-for-upload.component';

describe('CreateStateForUploadComponent', () => {
  let component: CreateStateForUploadComponent;
  let fixture: ComponentFixture<CreateStateForUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateStateForUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStateForUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
