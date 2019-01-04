import { TestBed, inject } from '@angular/core/testing';

import { SaldoIndividualAnticiposPrestamosService } from './saldo-individual-anticipos-prestamos.service';

describe('SaldoIndividualAnticiposPrestamosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoIndividualAnticiposPrestamosService]
    });
  });

  it('should be created', inject([SaldoIndividualAnticiposPrestamosService], (service: SaldoIndividualAnticiposPrestamosService) => {
    expect(service).toBeTruthy();
  }));
});
