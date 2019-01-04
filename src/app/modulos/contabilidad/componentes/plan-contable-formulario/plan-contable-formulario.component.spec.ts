import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanContableFormularioComponent } from './plan-contable-formulario.component';

describe('PlanContableFormularioComponent', () => {
  let component: PlanContableFormularioComponent;
  let fixture: ComponentFixture<PlanContableFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanContableFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanContableFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
