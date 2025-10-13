import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateClassInfoComponent} from './create-class-info.component';

describe('CreateClassInfoComponent', () => {
  let component: CreateClassInfoComponent;
  let fixture: ComponentFixture<CreateClassInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateClassInfoComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
