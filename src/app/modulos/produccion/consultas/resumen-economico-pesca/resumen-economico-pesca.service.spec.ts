import { TestBed } from '@angular/core/testing';

import { ResumenEconomicoPescaService } from './resumen-economico-pesca.service';

describe('ResumenEconomicoPescaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResumenEconomicoPescaService = TestBed.get(ResumenEconomicoPescaService);
    expect(service).toBeTruthy();
  });
});
