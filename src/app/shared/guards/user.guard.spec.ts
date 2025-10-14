import { TestBed } from "@angular/core/testing";

import { StaffUserOnlyGuard } from "./user.guard";

describe("StaffUserOnlyGuard", () => {
  let guard: StaffUserOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StaffUserOnlyGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
