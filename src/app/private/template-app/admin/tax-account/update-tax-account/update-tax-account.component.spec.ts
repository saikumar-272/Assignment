import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateTaxAccountComponent} from './update-tax-account.component';

describe('UpdateTaxAccountComponent', () => {
  let component: UpdateTaxAccountComponent;
  let fixture: ComponentFixture<UpdateTaxAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateTaxAccountComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaxAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
