import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSalesInvoiceListComponent} from './retrieve-sales-invoice-list.component';

describe('RetrieveSalesInvoiceListComponent', () => {
  let component: RetrieveSalesInvoiceListComponent;
  let fixture: ComponentFixture<RetrieveSalesInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSalesInvoiceListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSalesInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
