import { TestBed, inject } from '@angular/core/testing';

import { RetencionesRentaComprasConsolidadoService } from './retenciones-renta-compras-consolidado.service';

describe('RetencionesRentaComprasConsolidadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesRentaComprasConsolidadoService]
    });
  });

  it('should be created', inject([RetencionesRentaComprasConsolidadoService], (service: RetencionesRentaComprasConsolidadoService) => {
    expect(service).toBeTruthy();
  }));
});
