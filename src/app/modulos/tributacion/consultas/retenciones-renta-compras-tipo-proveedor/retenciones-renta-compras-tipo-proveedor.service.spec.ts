import { TestBed, inject } from '@angular/core/testing';

import { RetencionesRentaComprasTipoProveedorService } from './retenciones-renta-compras-tipo-proveedor.service';

describe('RetencionesRentaComprasTipoProveedorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesRentaComprasTipoProveedorService]
    });
  });

  it('should be created', inject([RetencionesRentaComprasTipoProveedorService], (service: RetencionesRentaComprasTipoProveedorService) => {
    expect(service).toBeTruthy();
  }));
});
