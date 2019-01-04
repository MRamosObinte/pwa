import { TestBed, inject } from '@angular/core/testing';

import { CuentasResultadosListadoService } from './cuentas-resultados-listado.service';

describe('CuentasResultadosListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuentasResultadosListadoService]
    });
  });

  it('should be created', inject([CuentasResultadosListadoService], (service: CuentasResultadosListadoService) => {
    expect(service).toBeTruthy();
  }));
});
