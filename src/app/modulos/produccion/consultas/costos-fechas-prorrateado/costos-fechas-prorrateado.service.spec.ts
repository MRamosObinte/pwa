import { TestBed } from '@angular/core/testing';

import { CostosFechasProrrateadoService } from './costos-fechas-prorrateado.service';

describe('CostosFechasProrrateadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostosFechasProrrateadoService = TestBed.get(CostosFechasProrrateadoService);
    expect(service).toBeTruthy();
  });
});
