import { TestBed } from '@angular/core/testing';

import { TallaPescaService } from './talla-pesca.service';

describe('TallaPescaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TallaPescaService = TestBed.get(TallaPescaService);
    expect(service).toBeTruthy();
  });
});
