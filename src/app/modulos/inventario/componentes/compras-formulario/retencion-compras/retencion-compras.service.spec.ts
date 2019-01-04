import { TestBed } from '@angular/core/testing';

import { RetencionComprasService } from './retencion-compras.service';

describe('RetencionComprasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetencionComprasService = TestBed.get(RetencionComprasService);
    expect(service).toBeTruthy();
  });
});
