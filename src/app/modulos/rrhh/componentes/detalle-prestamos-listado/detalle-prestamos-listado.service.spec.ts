import { TestBed } from '@angular/core/testing';

import { DetallePrestamosListadoService } from './detalle-prestamos-listado.service';

describe('DetallePrestamosListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetallePrestamosListadoService = TestBed.get(DetallePrestamosListadoService);
    expect(service).toBeTruthy();
  });
});
