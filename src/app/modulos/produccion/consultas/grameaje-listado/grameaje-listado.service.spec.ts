import { TestBed, inject } from '@angular/core/testing';

import { GrameajeListadoService } from './grameaje-listado.service';

describe('GrameajeListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrameajeListadoService]
    });
  });

  it('should be created', inject([GrameajeListadoService], (service: GrameajeListadoService) => {
    expect(service).toBeTruthy();
  }));
});
