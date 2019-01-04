import { TestBed } from '@angular/core/testing';

import { DetalleAnticiposListadoService } from './detalle-anticipos-listado.service';

describe('DetalleAnticiposListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetalleAnticiposListadoService = TestBed.get(DetalleAnticiposListadoService);
    expect(service).toBeTruthy();
  });
});
