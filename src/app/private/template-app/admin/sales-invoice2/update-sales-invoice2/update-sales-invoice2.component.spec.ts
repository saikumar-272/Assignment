import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateSalesInvoice2Component} from './update-sales-invoice2.component';

describe('UpdateSalesInvoice2Component', () => {
  let component: UpdateSalesInvoice2Component;
  let fixture: ComponentFixture<UpdateSalesInvoice2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateSalesInvoice2Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSalesInvoice2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
