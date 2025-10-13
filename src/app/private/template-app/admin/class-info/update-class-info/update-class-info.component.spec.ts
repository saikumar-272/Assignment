import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateClassInfoComponent} from './update-class-info.component';

describe('UpdateClassInfoComponent', () => {
  let component: UpdateClassInfoComponent;
  let fixture: ComponentFixture<UpdateClassInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateClassInfoComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateClassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
