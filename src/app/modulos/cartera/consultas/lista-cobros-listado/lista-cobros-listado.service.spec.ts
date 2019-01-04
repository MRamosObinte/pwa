import { TestBed } from '@angular/core/testing';

import { ListaCobrosListadoService } from './lista-cobros-listado.service';

describe('ListaCobrosListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaCobrosListadoService = TestBed.get(ListaCobrosListadoService);
    expect(service).toBeTruthy();
  });
});
