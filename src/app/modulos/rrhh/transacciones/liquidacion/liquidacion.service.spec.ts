import { TestBed } from '@angular/core/testing';

import { LiquidacionService } from './liquidacion.service';

describe('LiquidacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiquidacionService = TestBed.get(LiquidacionService);
    expect(service).toBeTruthy();
  });
});
