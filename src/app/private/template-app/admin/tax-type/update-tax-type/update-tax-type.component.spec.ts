import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateTaxTypeComponent} from './update-tax-type.component';

describe('UpdateTaxTypeComponent', () => {
  let component: UpdateTaxTypeComponent;
  let fixture: ComponentFixture<UpdateTaxTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateTaxTypeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
