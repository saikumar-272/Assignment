import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateSalesInvoiceComponent} from './update-sales-invoice.component';

describe('UpdateSalesInvoiceComponent', () => {
  let component: UpdateSalesInvoiceComponent;
  let fixture: ComponentFixture<UpdateSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateSalesInvoiceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
