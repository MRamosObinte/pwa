import { TestBed } from '@angular/core/testing';

import { CostosPiscinaMultipleService } from './costos-piscina-multiple.service';

describe('CostosPiscinaMultipleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostosPiscinaMultipleService = TestBed.get(CostosPiscinaMultipleService);
    expect(service).toBeTruthy();
  });
});
