import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSellerListComponent} from './retrieve-seller-list.component';

describe('RetrieveSellerListComponent', () => {
  let component: RetrieveSellerListComponent;
  let fixture: ComponentFixture<RetrieveSellerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSellerListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSellerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
