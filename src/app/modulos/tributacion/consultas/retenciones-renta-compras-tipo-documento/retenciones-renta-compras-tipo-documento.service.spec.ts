import { TestBed, inject } from '@angular/core/testing';

import { RetencionesRentaComprasTipoDocumentoService } from './retenciones-renta-compras-tipo-documento.service';

describe('RetencionesRentaComprasTipoDocumentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesRentaComprasTipoDocumentoService]
    });
  });

  it('should be created', inject([RetencionesRentaComprasTipoDocumentoService], (service: RetencionesRentaComprasTipoDocumentoService) => {
    expect(service).toBeTruthy();
  }));
});
