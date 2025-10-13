import {ComponentFixture, TestBed} from '@angular/core/testing';


import {ParentUserLandingComponent} from './parent-user-landing.component';

describe('ParentUserLandingComponent', () => {
  let component: ParentUserLandingComponent;
  let fixture: ComponentFixture<ParentUserLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParentUserLandingComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentUserLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
