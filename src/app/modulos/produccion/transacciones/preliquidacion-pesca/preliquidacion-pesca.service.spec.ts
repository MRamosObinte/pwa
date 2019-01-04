import { TestBed } from '@angular/core/testing';

import { PreliquidacionPescaService } from './preliquidacion-pesca.service';

describe('PreliquidacionPescaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreliquidacionPescaService = TestBed.get(PreliquidacionPescaService);
    expect(service).toBeTruthy();
  });
});
