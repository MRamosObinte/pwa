import { TestBed } from '@angular/core/testing';

import { PagosDetalleService } from './pagos-detalle.service';

describe('PagosDetalleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagosDetalleService = TestBed.get(PagosDetalleService);
    expect(service).toBeTruthy();
  });
});
