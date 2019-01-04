import { TestBed, inject } from '@angular/core/testing';

import { ConfiguracionCuentasContablesService } from './configuracion-cuentas-contables.service';

describe('ConfiguracionCuentasContablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfiguracionCuentasContablesService]
    });
  });

  it('should be created', inject([ConfiguracionCuentasContablesService], (service: ConfiguracionCuentasContablesService) => {
    expect(service).toBeTruthy();
  }));
});
