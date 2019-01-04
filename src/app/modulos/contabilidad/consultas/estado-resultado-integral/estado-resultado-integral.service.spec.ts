import { TestBed, inject } from '@angular/core/testing';

import { EstadoResultadoIntegralService } from './estado-resultado-integral.service';

describe('EstadoResultadoIntegralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoResultadoIntegralService]
    });
  });

  it('should be created', inject([EstadoResultadoIntegralService], (service: EstadoResultadoIntegralService) => {
    expect(service).toBeTruthy();
  }));
});
