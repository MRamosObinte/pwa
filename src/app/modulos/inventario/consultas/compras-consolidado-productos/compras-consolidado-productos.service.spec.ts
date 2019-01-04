import { TestBed, inject } from '@angular/core/testing';

import { ComprasConsolidadoProductosService } from './compras-consolidado-productos.service';

describe('ComprasConsolidadoProductosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComprasConsolidadoProductosService]
    });
  });

  it('should be created', inject([ComprasConsolidadoProductosService], (service: ComprasConsolidadoProductosService) => {
    expect(service).toBeTruthy();
  }));
});
