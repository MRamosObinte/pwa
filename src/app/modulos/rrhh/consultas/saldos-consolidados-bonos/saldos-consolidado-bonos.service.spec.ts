import { TestBed } from '@angular/core/testing';

import { SaldosConsolidadoBonosService } from './saldos-consolidado-bonos.service';

describe('SaldosConsolidadoBonosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaldosConsolidadoBonosService = TestBed.get(SaldosConsolidadoBonosService);
    expect(service).toBeTruthy();
  });
});
