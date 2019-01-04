import { TestBed, inject } from '@angular/core/testing';

import { VentasConsolidadoClientesService } from './ventas-consolidado-clientes.service';

describe('VentasConsolidadoClientesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentasConsolidadoClientesService]
    });
  });

  it('should be created', inject([VentasConsolidadoClientesService], (service: VentasConsolidadoClientesService) => {
    expect(service).toBeTruthy();
  }));
});
