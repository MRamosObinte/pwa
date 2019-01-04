import { TestBed, inject } from '@angular/core/testing';

import { VerificacionCuentasSobregiradasService } from './verificacion-cuentas-sobregiradas.service';

describe('VerificacionCuentasSobregiradasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerificacionCuentasSobregiradasService]
    });
  });

  it('should be created', inject([VerificacionCuentasSobregiradasService], (service: VerificacionCuentasSobregiradasService) => {
    expect(service).toBeTruthy();
  }));
});
