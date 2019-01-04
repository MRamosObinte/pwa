import { TestBed } from '@angular/core/testing';

import { LiquidacionPescaService } from './liquidacion-pesca.service';

describe('LiquidacionPescaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiquidacionPescaService = TestBed.get(LiquidacionPescaService);
    expect(service).toBeTruthy();
  });
});
