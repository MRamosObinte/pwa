import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanContableComponent } from './plan-contable.component';

describe('PlanContableComponent', () => {
  let component: PlanContableComponent;
  let fixture: ComponentFixture<PlanContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
