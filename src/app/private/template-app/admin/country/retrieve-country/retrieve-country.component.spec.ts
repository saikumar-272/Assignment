import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveCountryComponent} from './retrieve-country.component';

describe('RetrieveCountryComponent', () => {
  let component: RetrieveCountryComponent;
  let fixture: ComponentFixture<RetrieveCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveCountryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
