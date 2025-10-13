import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateStateComponent} from './create-state.component';

describe('CreateStateComponent', () => {
  let component: CreateStateComponent;
  let fixture: ComponentFixture<CreateStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CreateStateComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
