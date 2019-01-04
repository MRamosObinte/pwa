import { TestBed } from '@angular/core/testing';

import { DetalleAnticiposPrestamosListadoService } from './detalle-anticipos-prestamos-listado.service';

describe('DetalleAnticiposPrestamosListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetalleAnticiposPrestamosListadoService = TestBed.get(DetalleAnticiposPrestamosListadoService);
    expect(service).toBeTruthy();
  });
});
