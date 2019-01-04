import { TestBed } from '@angular/core/testing';

import { ProrrateoComprasService } from './prorrateo-compras.service';

describe('ProrrateoComprasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProrrateoComprasService = TestBed.get(ProrrateoComprasService);
    expect(service).toBeTruthy();
  });
});
