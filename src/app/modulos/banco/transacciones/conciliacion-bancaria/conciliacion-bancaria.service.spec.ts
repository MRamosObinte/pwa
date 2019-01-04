import { TestBed } from '@angular/core/testing';

import { ConciliacionBancariaService } from './conciliacion-bancaria.service';

describe('ConciliacionBancariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConciliacionBancariaService = TestBed.get(ConciliacionBancariaService);
    expect(service).toBeTruthy();
  });
});
