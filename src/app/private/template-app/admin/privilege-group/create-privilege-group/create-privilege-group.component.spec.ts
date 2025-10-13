import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatePrivilegeGroupComponent} from './create-privilege-group.component';

describe('CreatePrivilegeGroupComponent', () => {
  let component: CreatePrivilegeGroupComponent;
  let fixture: ComponentFixture<CreatePrivilegeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreatePrivilegeGroupComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrivilegeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
