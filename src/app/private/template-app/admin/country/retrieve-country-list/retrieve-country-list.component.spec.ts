import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveCountryListComponent} from './retrieve-country-list.component';

describe('RetrieveCountryListComponent', () => {
  let component: RetrieveCountryListComponent;
  let fixture: ComponentFixture<RetrieveCountryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveCountryListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
