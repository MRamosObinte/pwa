import { TestBed, inject } from '@angular/core/testing';

import { SaldoConsolidadoAnticiposPrestamosService } from './saldo-consolidado-anticipos-prestamos.service';

describe('SaldoConsolidadoAnticiposPrestamosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoConsolidadoAnticiposPrestamosService]
    });
  });

  it('should be created', inject([SaldoConsolidadoAnticiposPrestamosService], (service: SaldoConsolidadoAnticiposPrestamosService) => {
    expect(service).toBeTruthy();
  }));
});
