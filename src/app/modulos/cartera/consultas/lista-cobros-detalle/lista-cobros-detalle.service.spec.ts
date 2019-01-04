import { TestBed } from '@angular/core/testing';

import { ListaCobrosDetalleService } from './lista-cobros-detalle.service';

describe('ListaCobrosDetalleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaCobrosDetalleService = TestBed.get(ListaCobrosDetalleService);
    expect(service).toBeTruthy();
  });
});
