import { TestBed } from '@angular/core/testing';

import { SoporteContableAnticipoService } from './soporte-contable-anticipo.service';

describe('SoporteContableAnticipoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoporteContableAnticipoService = TestBed.get(SoporteContableAnticipoService);
    expect(service).toBeTruthy();
  });
});
