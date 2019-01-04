import { TestBed } from '@angular/core/testing';

import { CuentasCobrarGeneralService } from './cuentas-cobrar-general.service';

describe('CuentasCobrarGeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentasCobrarGeneralService = TestBed.get(CuentasCobrarGeneralService);
    expect(service).toBeTruthy();
  });
});
