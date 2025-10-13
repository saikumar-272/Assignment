import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveBuyerComponent} from './retrieve-buyer.component';

describe('RetrieveBuyerComponent', () => {
  let component: RetrieveBuyerComponent;
  let fixture: ComponentFixture<RetrieveBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveBuyerComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
