import { TestBed, inject } from '@angular/core/testing';

import { EstadoResultadoVsInventarioService } from './estado-resultado-vs-inventario.service';

describe('EstadoResultadoVsInventarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoResultadoVsInventarioService]
    });
  });

  it('should be created', inject([EstadoResultadoVsInventarioService], (service: EstadoResultadoVsInventarioService) => {
    expect(service).toBeTruthy();
  }));
});
