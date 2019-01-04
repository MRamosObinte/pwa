import { TestBed, inject } from '@angular/core/testing';

import { ListadoDevolucionIvaComprasService } from './listado-devolucion-iva-compras.service';

describe('ListadoDevolucionIvaComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoDevolucionIvaComprasService]
    });
  });

  it('should be created', inject([ListadoDevolucionIvaComprasService], (service: ListadoDevolucionIvaComprasService) => {
    expect(service).toBeTruthy();
  }));
});
