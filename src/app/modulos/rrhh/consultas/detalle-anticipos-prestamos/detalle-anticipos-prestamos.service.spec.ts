import { TestBed, inject } from '@angular/core/testing';

import { DetalleAnticiposPrestamosService } from './detalle-anticipos-prestamos.service';

describe('DetalleAnticiposPrestamosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetalleAnticiposPrestamosService]
    });
  });

  it('should be created', inject([DetalleAnticiposPrestamosService], (service: DetalleAnticiposPrestamosService) => {
    expect(service).toBeTruthy();
  }));
});
