import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveTaxTypeComponent} from './retrieve-tax-type.component';

describe('RetrieveTaxTypeComponent', () => {
  let component: RetrieveTaxTypeComponent;
  let fixture: ComponentFixture<RetrieveTaxTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveTaxTypeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveTaxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
