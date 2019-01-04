import { TestBed } from '@angular/core/testing';

import { CorridaListadoService } from './corrida-listado.service';

describe('CorridaListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorridaListadoService = TestBed.get(CorridaListadoService);
    expect(service).toBeTruthy();
  });
});
