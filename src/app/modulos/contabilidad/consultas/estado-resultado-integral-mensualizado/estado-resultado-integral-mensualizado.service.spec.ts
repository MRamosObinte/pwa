import { TestBed, inject } from '@angular/core/testing';

import { EstadoResultadoIntegralMensualizadoService } from './estado-resultado-integral-mensualizado.service';

describe('EstadoResultadoIntegralMensualizadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoResultadoIntegralMensualizadoService]
    });
  });

  it('should be created', inject([EstadoResultadoIntegralMensualizadoService], (service: EstadoResultadoIntegralMensualizadoService) => {
    expect(service).toBeTruthy();
  }));
});
