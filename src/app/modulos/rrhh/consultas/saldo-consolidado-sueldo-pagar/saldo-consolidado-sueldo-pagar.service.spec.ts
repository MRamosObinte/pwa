import { TestBed, inject } from '@angular/core/testing';

import { SaldoConsolidadoSueldoPagarService } from './saldo-consolidado-sueldo-pagar.service';

describe('SaldoConsolidadoSueldoPagarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoConsolidadoSueldoPagarService]
    });
  });

  it('should be created', inject([SaldoConsolidadoSueldoPagarService], (service: SaldoConsolidadoSueldoPagarService) => {
    expect(service).toBeTruthy();
  }));
});
