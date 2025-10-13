import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEmailNotificationTestComponent} from './create-email-notification-test.component';

describe('CreateEmailNotificationTestComponent', () => {
  let component: CreateEmailNotificationTestComponent;
  let fixture: ComponentFixture<CreateEmailNotificationTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateEmailNotificationTestComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmailNotificationTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
