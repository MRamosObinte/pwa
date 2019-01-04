import { TestBed, inject } from '@angular/core/testing';

import { EstadoSituacionFinancieroService } from './estado-situacion-financiero.service';

describe('EstadoSituacionFinancieroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoSituacionFinancieroService]
    });
  });

  it('should be created', inject([EstadoSituacionFinancieroService], (service: EstadoSituacionFinancieroService) => {
    expect(service).toBeTruthy();
  }));
});
