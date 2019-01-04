import { TestBed } from '@angular/core/testing';

import { PagosListadoService } from './pagos-listado.service';

describe('PagosListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagosListadoService = TestBed.get(PagosListadoService);
    expect(service).toBeTruthy();
  });
});
