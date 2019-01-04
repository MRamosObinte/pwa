import { TestBed, inject } from '@angular/core/testing';

import { UtilidadDiariaResumenBiologicoService } from './utilidad-diaria-resumen-biologico.service';

describe('UtilidadDiariaResumenBiologicoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilidadDiariaResumenBiologicoService]
    });
  });

  it('should be created', inject([UtilidadDiariaResumenBiologicoService], (service: UtilidadDiariaResumenBiologicoService) => {
    expect(service).toBeTruthy();
  }));
});
