import { TestBed, inject } from '@angular/core/testing';

import { ConsolidadoIngresosTabuladosService } from './consolidado-ingresos-tabulados.service';

describe('ConsolidadoIngresosTabuladosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsolidadoIngresosTabuladosService]
    });
  });

  it('should be created', inject([ConsolidadoIngresosTabuladosService], (service: ConsolidadoIngresosTabuladosService) => {
    expect(service).toBeTruthy();
  }));
});
