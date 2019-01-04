import { TestBed } from '@angular/core/testing';

import { PagosListadoCompraService } from './pagos-listado-compra.service';

describe('PagosListadoCompraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagosListadoCompraService = TestBed.get(PagosListadoCompraService);
    expect(service).toBeTruthy();
  });
});
