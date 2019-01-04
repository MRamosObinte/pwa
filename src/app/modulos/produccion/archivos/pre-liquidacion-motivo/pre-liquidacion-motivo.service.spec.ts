import { TestBed } from '@angular/core/testing';

import { PreLiquidacionMotivoService } from './pre-liquidacion-motivo.service';

describe('PreLiquidacionMotivoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreLiquidacionMotivoService = TestBed.get(PreLiquidacionMotivoService);
    expect(service).toBeTruthy();
  });
});
