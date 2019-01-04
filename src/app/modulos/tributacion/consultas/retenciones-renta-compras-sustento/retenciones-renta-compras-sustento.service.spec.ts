import { TestBed, inject } from '@angular/core/testing';

import { RetencionesRentaComprasSustentoService } from './retenciones-renta-compras-sustento.service';

describe('RetencionesRentaComprasSustentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesRentaComprasSustentoService]
    });
  });

  it('should be created', inject([RetencionesRentaComprasSustentoService], (service: RetencionesRentaComprasSustentoService) => {
    expect(service).toBeTruthy();
  }));
});
