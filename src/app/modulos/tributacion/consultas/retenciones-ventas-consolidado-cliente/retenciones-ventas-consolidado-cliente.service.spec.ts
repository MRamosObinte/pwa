import { TestBed, inject } from '@angular/core/testing';

import { RetencionesVentasConsolidadoClienteService } from './retenciones-ventas-consolidado-cliente.service';

describe('RetencionesVentasConsolidadoClienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesVentasConsolidadoClienteService]
    });
  });

  it('should be created', inject([RetencionesVentasConsolidadoClienteService], (service: RetencionesVentasConsolidadoClienteService) => {
    expect(service).toBeTruthy();
  }));
});
