import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParentWelcomePageComponent} from './parent-welcome-page.component';

describe('ParentWelcomePageComponent', () => {
  let component: ParentWelcomePageComponent;
  let fixture: ComponentFixture<ParentWelcomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParentWelcomePageComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentWelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
