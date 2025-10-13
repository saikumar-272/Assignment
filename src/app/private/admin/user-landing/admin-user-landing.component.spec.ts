import {ComponentFixture, TestBed} from '@angular/core/testing';


import {AdminUserLandingComponent} from './admin-user-landing.component';

describe('AdminUserLandingComponent', () => {
  let component: AdminUserLandingComponent;
  let fixture: ComponentFixture<AdminUserLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AdminUserLandingComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
