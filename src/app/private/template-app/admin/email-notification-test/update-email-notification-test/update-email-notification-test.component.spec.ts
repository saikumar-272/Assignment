import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateEmailNotificationTestComponent} from './update-email-notification-test.component';

describe('UpdateEmailNotificationTestComponent', () => {
  let component: UpdateEmailNotificationTestComponent;
  let fixture: ComponentFixture<UpdateEmailNotificationTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateEmailNotificationTestComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmailNotificationTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
