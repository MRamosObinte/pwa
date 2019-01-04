import { TestBed, inject } from '@angular/core/testing';

import { ListadoComprasService } from './listado-compras.service';

describe('ListadoComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoComprasService]
    });
  });

  it('should be created', inject([ListadoComprasService], (service: ListadoComprasService) => {
    expect(service).toBeTruthy();
  }));
});
