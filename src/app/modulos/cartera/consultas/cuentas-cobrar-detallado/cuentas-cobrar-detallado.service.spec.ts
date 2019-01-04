import { TestBed } from '@angular/core/testing';

import { CuentasCobrarDetalladoService } from './cuentas-cobrar-detallado.service';

describe('CuentasCobrarDetalladoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentasCobrarDetalladoService = TestBed.get(CuentasCobrarDetalladoService);
    expect(service).toBeTruthy();
  });
});
