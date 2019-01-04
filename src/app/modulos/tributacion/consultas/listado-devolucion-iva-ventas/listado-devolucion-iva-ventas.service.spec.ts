import { TestBed, inject } from '@angular/core/testing';

import { ListadoDevolucionIvaVentasService } from './listado-devolucion-iva-ventas.service';

describe('ListadoDevolucionIvaVentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoDevolucionIvaVentasService]
    });
  });

  it('should be created', inject([ListadoDevolucionIvaVentasService], (service: ListadoDevolucionIvaVentasService) => {
    expect(service).toBeTruthy();
  }));
});
