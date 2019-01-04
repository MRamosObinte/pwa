import { TestBed, inject } from '@angular/core/testing';

import { EstadoSituacionFinancieroComparativoService } from './estado-situacion-financiero-comparativo.service';

describe('EstadoSituacionFinancieroComparativoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoSituacionFinancieroComparativoService]
    });
  });

  it('should be created', inject([EstadoSituacionFinancieroComparativoService], (service: EstadoSituacionFinancieroComparativoService) => {
    expect(service).toBeTruthy();
  }));
});
