import { TestBed, inject } from '@angular/core/testing';

import { AnalisisPesosCrecimientoService } from './analisis-pesos-crecimiento.service';

describe('AnalisisPesosCrecimientoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalisisPesosCrecimientoService]
    });
  });

  it('should be created', inject([AnalisisPesosCrecimientoService], (service: AnalisisPesosCrecimientoService) => {
    expect(service).toBeTruthy();
  }));
});
