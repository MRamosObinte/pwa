import { TestBed } from '@angular/core/testing';

import { ResumenEconomicoSiembraService } from './resumen-economico-siembra.service';

describe('ResumenEconomicoSiembraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResumenEconomicoSiembraService = TestBed.get(ResumenEconomicoSiembraService);
    expect(service).toBeTruthy();
  });
});
