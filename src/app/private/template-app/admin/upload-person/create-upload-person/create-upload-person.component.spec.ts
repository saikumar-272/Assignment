import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateUploadPersonComponent} from './create-upload-person.component';

describe('CreateUploadPersonComponent', () => {
  let component: CreateUploadPersonComponent;
  let fixture: ComponentFixture<CreateUploadPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateUploadPersonComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUploadPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
