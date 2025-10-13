import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateUploadPersonComponent} from './update-upload-person.component';

describe('UpdateUploadPersonComponent', () => {
  let component: UpdateUploadPersonComponent;
  let fixture: ComponentFixture<UpdateUploadPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateUploadPersonComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUploadPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
