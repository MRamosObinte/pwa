import { TestBed } from '@angular/core/testing';

import { SoporteContableBonosService } from './soporte-contable-bonos.service';

describe('SoporteContableBonosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoporteContableBonosService = TestBed.get(SoporteContableBonosService);
    expect(service).toBeTruthy();
  });
});
