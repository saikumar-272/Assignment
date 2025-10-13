import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveSalesInvoice2ListComponent} from './retrieve-sales-invoice2-list.component';

describe('RetrieveSalesInvoice2ListComponent', () => {
  let component: RetrieveSalesInvoice2ListComponent;
  let fixture: ComponentFixture<RetrieveSalesInvoice2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveSalesInvoice2ListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSalesInvoice2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
