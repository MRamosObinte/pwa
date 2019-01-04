import { TestBed, inject } from '@angular/core/testing';

import { ConsolidadoAnticiposPrestamosService } from './consolidado-anticipos-prestamos.service';

describe('ConsolidadoAnticiposPrestamosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsolidadoAnticiposPrestamosService]
    });
  });

  it('should be created', inject([ConsolidadoAnticiposPrestamosService], (service: ConsolidadoAnticiposPrestamosService) => {
    expect(service).toBeTruthy();
  }));
});
