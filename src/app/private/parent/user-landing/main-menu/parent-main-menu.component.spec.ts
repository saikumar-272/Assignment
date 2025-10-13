import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParentMainMenuComponent} from './parent-main-menu.component';

describe('MainMenuComponent', () => {
  let component: ParentMainMenuComponent;
  let fixture: ComponentFixture<ParentMainMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ParentMainMenuComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
