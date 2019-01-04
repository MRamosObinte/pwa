import { TestBed, inject } from '@angular/core/testing';

import { RetencionesRentaComprasConceptoService } from './retenciones-renta-compras-concepto.service';

describe('RetencionesRentaComprasConceptoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesRentaComprasConceptoService]
    });
  });

  it('should be created', inject([RetencionesRentaComprasConceptoService], (service: RetencionesRentaComprasConceptoService) => {
    expect(service).toBeTruthy();
  }));
});
