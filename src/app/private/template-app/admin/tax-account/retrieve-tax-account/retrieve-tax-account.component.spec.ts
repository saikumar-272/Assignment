import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveTaxAccountComponent} from './retrieve-tax-account.component';

describe('RetrieveTaxAccountComponent', () => {
  let component: RetrieveTaxAccountComponent;
  let fixture: ComponentFixture<RetrieveTaxAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveTaxAccountComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveTaxAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
