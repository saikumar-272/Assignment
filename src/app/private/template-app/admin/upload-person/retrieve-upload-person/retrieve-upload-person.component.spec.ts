import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveUploadPersonComponent} from './retrieve-upload-person.component';

describe('RetrieveUploadPersonComponent', () => {
  let component: RetrieveUploadPersonComponent;
  let fixture: ComponentFixture<RetrieveUploadPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveUploadPersonComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUploadPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
