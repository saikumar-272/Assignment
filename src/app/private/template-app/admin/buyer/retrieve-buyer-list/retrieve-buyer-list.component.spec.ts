import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveBuyerListComponent} from './retrieve-buyer-list.component';

describe('RetrieveBuyerListComponent', () => {
  let component: RetrieveBuyerListComponent;
  let fixture: ComponentFixture<RetrieveBuyerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveBuyerListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveBuyerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
