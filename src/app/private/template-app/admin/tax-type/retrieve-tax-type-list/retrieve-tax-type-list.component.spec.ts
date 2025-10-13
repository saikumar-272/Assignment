import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveTaxTypeListComponent} from './retrieve-tax-type-list.component';

describe('RetrieveTaxTypeListComponent', () => {
  let component: RetrieveTaxTypeListComponent;
  let fixture: ComponentFixture<RetrieveTaxTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveTaxTypeListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveTaxTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
