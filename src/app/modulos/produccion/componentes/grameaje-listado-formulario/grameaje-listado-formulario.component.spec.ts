import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajeListadoFormularioComponent } from './grameaje-listado-formulario.component';

describe('GrameajeListadoFormularioComponent', () => {
  let component: GrameajeListadoFormularioComponent;
  let fixture: ComponentFixture<GrameajeListadoFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajeListadoFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajeListadoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
