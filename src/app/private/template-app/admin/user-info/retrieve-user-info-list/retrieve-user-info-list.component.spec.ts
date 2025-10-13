import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveUserInfoListComponent} from './retrieve-user-info-list.component';

describe('RetrieveUserInfoListComponent', () => {
  let component: RetrieveUserInfoListComponent;
  let fixture: ComponentFixture<RetrieveUserInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveUserInfoListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveUserInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
