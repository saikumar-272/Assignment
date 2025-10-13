import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSalesInvoice2Component} from './retrieve-sales-invoice2.component';

describe('RetrieveSalesInvoice2Component', () => {
  let component: RetrieveSalesInvoice2Component;
  let fixture: ComponentFixture<RetrieveSalesInvoice2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSalesInvoice2Component]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSalesInvoice2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
