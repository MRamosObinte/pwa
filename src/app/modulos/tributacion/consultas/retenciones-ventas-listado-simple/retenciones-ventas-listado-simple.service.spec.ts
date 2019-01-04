import { TestBed, inject } from '@angular/core/testing';

import { RetencionesVentasListadoSimpleService } from './retenciones-ventas-listado-simple.service';

describe('RetencionesVentasListadoSimpleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesVentasListadoSimpleService]
    });
  });

  it('should be created', inject([RetencionesVentasListadoSimpleService], (service: RetencionesVentasListadoSimpleService) => {
    expect(service).toBeTruthy();
  }));
});
