import { TestBed } from '@angular/core/testing';

import { CostosMensualesService } from './costos-mensuales.service';

describe('CostosMensualesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostosMensualesService = TestBed.get(CostosMensualesService);
    expect(service).toBeTruthy();
  });
});
