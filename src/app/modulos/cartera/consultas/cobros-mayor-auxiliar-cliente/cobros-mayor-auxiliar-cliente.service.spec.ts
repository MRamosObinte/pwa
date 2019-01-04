import { TestBed } from '@angular/core/testing';

import { CobrosMayorAuxiliarClienteService } from './cobros-mayor-auxiliar-cliente.service';

describe('CobrosMayorAuxiliarClienteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobrosMayorAuxiliarClienteService = TestBed.get(CobrosMayorAuxiliarClienteService);
    expect(service).toBeTruthy();
  });
});
