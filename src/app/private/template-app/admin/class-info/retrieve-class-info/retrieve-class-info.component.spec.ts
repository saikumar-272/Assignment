import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveClassInfoComponent} from './retrieve-class-info.component';

describe('RetrieveClassInfoComponent', () => {
  let component: RetrieveClassInfoComponent;
  let fixture: ComponentFixture<RetrieveClassInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveClassInfoComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveClassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
