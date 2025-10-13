import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveTaxAccountListComponent} from './retrieve-tax-account-list.component';

describe('RetrieveTaxAccountListComponent', () => {
  let component: RetrieveTaxAccountListComponent;
  let fixture: ComponentFixture<RetrieveTaxAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveTaxAccountListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveTaxAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
