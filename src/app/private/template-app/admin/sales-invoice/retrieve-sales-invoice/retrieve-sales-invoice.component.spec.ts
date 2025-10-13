import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSalesInvoiceComponent} from './retrieve-sales-invoice.component';

describe('RetrieveSalesInvoiceComponent', () => {
  let component: RetrieveSalesInvoiceComponent;
  let fixture: ComponentFixture<RetrieveSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSalesInvoiceComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
