import { TestBed, inject } from '@angular/core/testing';

import { ContabilizarCierreCuentasService } from './contabilizar-cierre-cuentas.service';

describe('ContabilizarCierreCuentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContabilizarCierreCuentasService]
    });
  });

  it('should be created', inject([ContabilizarCierreCuentasService], (service: ContabilizarCierreCuentasService) => {
    expect(service).toBeTruthy();
  }));
});
