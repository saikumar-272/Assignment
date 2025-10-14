import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RetrieveCounryForUploadListComponent } from "./UI_PAGE_NAME_LOWER_CASE_HYPHENATED.component";

describe("RetrieveCounryForUploadListComponent", () => {
  let component: RetrieveCounryForUploadListComponent;
  let fixture: ComponentFixture<RetrieveCounryForUploadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrieveCounryForUploadListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveCounryForUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
