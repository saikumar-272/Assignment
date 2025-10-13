import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveClassInfoListComponent} from './retrieve-class-info-list.component';

describe('RetrieveClassInfoListComponent', () => {
  let component: RetrieveClassInfoListComponent;
  let fixture: ComponentFixture<RetrieveClassInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveClassInfoListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveClassInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
