import { TestBed, inject } from '@angular/core/testing';

import { ConsolidadoIngresosService } from './consolidado-ingresos.service';

describe('ConsolidadoIngresosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsolidadoIngresosService]
    });
  });

  it('should be created', inject([ConsolidadoIngresosService], (service: ConsolidadoIngresosService) => {
    expect(service).toBeTruthy();
  }));
});
