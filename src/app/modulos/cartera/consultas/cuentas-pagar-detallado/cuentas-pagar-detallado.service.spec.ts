import { TestBed } from '@angular/core/testing';

import { CuentasPagarDetalladoService } from './cuentas-pagar-detallado.service';

describe('CuentasPagarDetalladoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentasPagarDetalladoService = TestBed.get(CuentasPagarDetalladoService);
    expect(service).toBeTruthy();
  });
});
