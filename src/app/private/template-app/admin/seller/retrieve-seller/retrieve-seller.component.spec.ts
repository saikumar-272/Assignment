import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSellerComponent} from './retrieve-seller.component';

describe('RetrieveSellerComponent', () => {
  let component: RetrieveSellerComponent;
  let fixture: ComponentFixture<RetrieveSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSellerComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
