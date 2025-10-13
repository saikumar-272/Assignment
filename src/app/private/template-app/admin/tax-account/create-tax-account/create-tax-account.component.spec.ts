import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTaxAccountComponent} from './create-tax-account.component';

describe('CreateTaxAccountComponent', () => {
  let component: CreateTaxAccountComponent;
  let fixture: ComponentFixture<CreateTaxAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateTaxAccountComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaxAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
