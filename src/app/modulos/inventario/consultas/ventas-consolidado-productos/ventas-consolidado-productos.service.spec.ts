import { TestBed, inject } from '@angular/core/testing';

import { VentasConsolidadoProductosService } from './ventas-consolidado-productos.service';

describe('VentasConsolidadoProductosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentasConsolidadoProductosService]
    });
  });

  it('should be created', inject([VentasConsolidadoProductosService], (service: VentasConsolidadoProductosService) => {
    expect(service).toBeTruthy();
  }));
});
