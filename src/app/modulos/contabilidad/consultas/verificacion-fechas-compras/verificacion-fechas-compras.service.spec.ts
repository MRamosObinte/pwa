import { TestBed, inject } from '@angular/core/testing';

import { VerificacionFechasComprasService } from './verificacion-fechas-compras.service';

describe('VerificacionFechasComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerificacionFechasComprasService]
    });
  });

  it('should be created', inject([VerificacionFechasComprasService], (service: VerificacionFechasComprasService) => {
    expect(service).toBeTruthy();
  }));
});
