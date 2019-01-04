import { TestBed, inject } from '@angular/core/testing';

import { VentaListadoService } from './venta-listado.service';

describe('VentaListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentaListadoService]
    });
  });

  it('should be created', inject([VentaListadoService], (service: VentaListadoService) => {
    expect(service).toBeTruthy();
  }));
});
