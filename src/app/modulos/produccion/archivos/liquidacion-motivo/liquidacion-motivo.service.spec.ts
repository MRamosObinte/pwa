import { TestBed } from '@angular/core/testing';

import { LiquidacionMotivoService } from './liquidacion-motivo.service';

describe('LiquidacionMotivoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiquidacionMotivoService = TestBed.get(LiquidacionMotivoService);
    expect(service).toBeTruthy();
  });
});
