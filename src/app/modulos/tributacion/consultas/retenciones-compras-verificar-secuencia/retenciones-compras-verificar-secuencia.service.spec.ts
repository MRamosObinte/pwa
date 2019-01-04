import { TestBed, inject } from '@angular/core/testing';

import { RetencionesComprasVerificarSecuenciaService } from './retenciones-compras-verificar-secuencia.service';

describe('RetencionesComprasVerificarSecuenciaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesComprasVerificarSecuenciaService]
    });
  });

  it('should be created', inject([RetencionesComprasVerificarSecuenciaService], (service: RetencionesComprasVerificarSecuenciaService) => {
    expect(service).toBeTruthy();
  }));
});
