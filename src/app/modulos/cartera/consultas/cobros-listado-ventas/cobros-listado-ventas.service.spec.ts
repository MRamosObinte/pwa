import { TestBed } from '@angular/core/testing';

import { CobrosListadoVentasService } from './cobros-listado-ventas.service';

describe('CobrosListadoVentasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobrosListadoVentasService = TestBed.get(CobrosListadoVentasService);
    expect(service).toBeTruthy();
  });
});
