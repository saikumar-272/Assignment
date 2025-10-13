import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmailNotificationTestComponent} from './retrieve-email-notification-test.component';

describe('RetrieveEmailNotificationTestComponent', () => {
  let component: RetrieveEmailNotificationTestComponent;
  let fixture: ComponentFixture<RetrieveEmailNotificationTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmailNotificationTestComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmailNotificationTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
