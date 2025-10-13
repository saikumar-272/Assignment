import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateSalesInvoice2Component} from './create-sales-invoice2.component';

describe('CreateSalesInvoice2Component', () => {
  let component: CreateSalesInvoice2Component;
  let fixture: ComponentFixture<CreateSalesInvoice2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateSalesInvoice2Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSalesInvoice2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
