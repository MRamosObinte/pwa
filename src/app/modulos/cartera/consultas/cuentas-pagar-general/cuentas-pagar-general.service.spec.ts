import { TestBed } from '@angular/core/testing';

import { CuentasPagarGeneralService } from './cuentas-pagar-general.service';

describe('CuentasPagarGeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentasPagarGeneralService = TestBed.get(CuentasPagarGeneralService);
    expect(service).toBeTruthy();
  });
});
