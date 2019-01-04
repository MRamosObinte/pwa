import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesVentasConsolidadoClienteComponent } from './retenciones-ventas-consolidado-cliente.component';

describe('RetencionesVentasConsolidadoClienteComponent', () => {
  let component: RetencionesVentasConsolidadoClienteComponent;
  let fixture: ComponentFixture<RetencionesVentasConsolidadoClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionesVentasConsolidadoClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesVentasConsolidadoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
