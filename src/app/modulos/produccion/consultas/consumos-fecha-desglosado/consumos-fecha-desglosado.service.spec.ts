import { TestBed, inject } from '@angular/core/testing';

import { ConsumosFechaDesglosadoService } from './consumos-fecha-desglosado.service';

describe('ConsumosFechaDesglosadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosFechaDesglosadoService]
    });
  });

  it('should be created', inject([ConsumosFechaDesglosadoService], (service: ConsumosFechaDesglosadoService) => {
    expect(service).toBeTruthy();
  }));
});
