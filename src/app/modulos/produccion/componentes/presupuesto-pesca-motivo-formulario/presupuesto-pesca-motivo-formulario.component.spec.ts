import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoPescaMotivoFormularioComponent } from './presupuesto-pesca-motivo-formulario.component';

describe('PresupuestoPescaMotivoFormularioComponent', () => {
  let component: PresupuestoPescaMotivoFormularioComponent;
  let fixture: ComponentFixture<PresupuestoPescaMotivoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoPescaMotivoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoPescaMotivoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
