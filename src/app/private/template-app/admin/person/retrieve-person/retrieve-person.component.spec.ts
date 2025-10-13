import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrievePersonComponent} from './retrieve-person.component';

describe('RetrievePersonComponent', () => {
  let component: RetrievePersonComponent;
  let fixture: ComponentFixture<RetrievePersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrievePersonComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
