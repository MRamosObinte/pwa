import { TestBed, inject } from '@angular/core/testing';

import { ComprasConsolidadoProductosMensualService } from './compras-consolidado-productos-mensual.service';

describe('ComprasConsolidadoProductosMensualService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComprasConsolidadoProductosMensualService]
    });
  });

  it('should be created', inject([ComprasConsolidadoProductosMensualService], (service: ComprasConsolidadoProductosMensualService) => {
    expect(service).toBeTruthy();
  }));
});
