import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RetrieveAssetComponent} from './retrieve-asset.component';

describe('RetrieveAssetComponent', () => {
  let component: RetrieveAssetComponent;
  let fixture: ComponentFixture<RetrieveAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RetrieveAssetComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
