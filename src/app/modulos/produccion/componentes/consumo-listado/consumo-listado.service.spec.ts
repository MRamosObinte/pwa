import { TestBed, inject } from '@angular/core/testing';

import { ConsumoListadoService } from './consumo-listado.service';

describe('ConsumoListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumoListadoService]
    });
  });

  it('should be created', inject([ConsumoListadoService], (service: ConsumoListadoService) => {
    expect(service).toBeTruthy();
  }));
});
