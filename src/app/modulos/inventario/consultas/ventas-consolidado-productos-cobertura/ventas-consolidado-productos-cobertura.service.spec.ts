import { TestBed, inject } from '@angular/core/testing';

import { VentasConsolidadoProductosCoberturaService } from './ventas-consolidado-productos-cobertura.service';

describe('VentasConsolidadoProductosCoberturaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentasConsolidadoProductosCoberturaService]
    });
  });

  it('should be created', inject([VentasConsolidadoProductosCoberturaService], (service: VentasConsolidadoProductosCoberturaService) => {
    expect(service).toBeTruthy();
  }));
});
