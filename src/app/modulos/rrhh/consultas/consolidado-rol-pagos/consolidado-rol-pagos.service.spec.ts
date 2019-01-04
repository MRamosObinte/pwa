import { TestBed, inject } from '@angular/core/testing';

import { ConsolidadoRolPagosService } from './consolidado-rol-pagos.service';

describe('ConsolidadoRolPagosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsolidadoRolPagosService]
    });
  });

  it('should be created', inject([ConsolidadoRolPagosService], (service: ConsolidadoRolPagosService) => {
    expect(service).toBeTruthy();
  }));
});
