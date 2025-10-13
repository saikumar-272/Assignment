import {ComponentFixture, TestBed} from "@angular/core/testing";

import {UpdateStudentLeaveComponent} from "./update-student-leave.component";

describe("UpdateStudentLeaveComponent", () => {
  let component: UpdateStudentLeaveComponent;
  let fixture: ComponentFixture<UpdateStudentLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UpdateStudentLeaveComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudentLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
