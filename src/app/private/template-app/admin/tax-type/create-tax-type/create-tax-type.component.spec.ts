import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTaxTypeComponent} from './create-tax-type.component';

describe('CreateTaxTypeComponent', () => {
  let component: CreateTaxTypeComponent;
  let fixture: ComponentFixture<CreateTaxTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateTaxTypeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
