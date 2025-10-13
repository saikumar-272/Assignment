import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveEmailNotificationTestListComponent} from './retrieve-email-notification-test-list.component';

describe('RetrieveEmailNotificationTestListComponent', () => {
  let component: RetrieveEmailNotificationTestListComponent;
  let fixture: ComponentFixture<RetrieveEmailNotificationTestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveEmailNotificationTestListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveEmailNotificationTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
