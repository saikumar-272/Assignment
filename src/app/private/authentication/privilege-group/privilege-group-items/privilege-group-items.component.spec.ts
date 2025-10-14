import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PrivilegeGroupItemsComponent } from "./privilege-group-items.component";

describe("PrivilegeGroupItemsComponent", () => {
  let component: PrivilegeGroupItemsComponent;
  let fixture: ComponentFixture<PrivilegeGroupItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivilegeGroupItemsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivilegeGroupItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
