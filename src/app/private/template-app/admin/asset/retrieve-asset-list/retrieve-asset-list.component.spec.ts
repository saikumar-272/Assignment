import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveAssetListComponent} from './retrieve-asset-list.component';

describe('RetrieveAssetListComponent', () => {
  let component: RetrieveAssetListComponent;
  let fixture: ComponentFixture<RetrieveAssetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveAssetListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
