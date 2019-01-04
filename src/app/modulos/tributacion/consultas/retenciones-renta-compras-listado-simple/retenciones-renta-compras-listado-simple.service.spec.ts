import { TestBed, inject } from '@angular/core/testing';

import { RetencionesRentaComprasListadoSimpleService } from './retenciones-renta-compras-listado-simple.service';

describe('RetencionesRentaComprasListadoSimpleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesRentaComprasListadoSimpleService]
    });
  });

  it('should be created', inject([RetencionesRentaComprasListadoSimpleService], (service: RetencionesRentaComprasListadoSimpleService) => {
    expect(service).toBeTruthy();
  }));
});
