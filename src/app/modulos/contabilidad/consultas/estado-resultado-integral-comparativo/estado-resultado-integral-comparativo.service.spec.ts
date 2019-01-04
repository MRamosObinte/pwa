import { TestBed, inject } from '@angular/core/testing';

import { EstadoResultadoIntegralComparativoService } from './estado-resultado-integral-comparativo.service';

describe('EstadoResultadoIntegralComparativoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoResultadoIntegralComparativoService]
    });
  });

  it('should be created', inject([EstadoResultadoIntegralComparativoService], (service: EstadoResultadoIntegralComparativoService) => {
    expect(service).toBeTruthy();
  }));
});
