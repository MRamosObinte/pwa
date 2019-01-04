import { TestBed, inject } from '@angular/core/testing';

import { EstadoComprobacionService } from './estado-comprobacion.service';

describe('EstadoComprobacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadoComprobacionService]
    });
  });

  it('should be created', inject([EstadoComprobacionService], (service: EstadoComprobacionService) => {
    expect(service).toBeTruthy();
  }));
});
