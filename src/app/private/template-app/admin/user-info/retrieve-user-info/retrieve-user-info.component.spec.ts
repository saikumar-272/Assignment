import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveUserInfoComponent} from './retrieve-user-info.component';

describe('RetrieveUserInfoComponent', () => {
  let component: RetrieveUserInfoComponent;
  let fixture: ComponentFixture<RetrieveUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveUserInfoComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
