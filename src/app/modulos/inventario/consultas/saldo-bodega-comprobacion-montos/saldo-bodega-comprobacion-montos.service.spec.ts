import { TestBed, inject } from '@angular/core/testing';

import { SaldoBodegaComprobacionMontosService } from './saldo-bodega-comprobacion-montos.service';

describe('SaldoBodegaComprobacionMontosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoBodegaComprobacionMontosService]
    });
  });

  it('should be created', inject([SaldoBodegaComprobacionMontosService], (service: SaldoBodegaComprobacionMontosService) => {
    expect(service).toBeTruthy();
  }));
});
