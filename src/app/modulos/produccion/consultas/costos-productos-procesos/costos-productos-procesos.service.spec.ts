import { TestBed, inject } from '@angular/core/testing';

import { CostosProductosProcesosService } from './costos-productos-procesos.service';

describe('CostosProductosProcesosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostosProductosProcesosService]
    });
  });

  it('should be created', inject([CostosProductosProcesosService], (service: CostosProductosProcesosService) => {
    expect(service).toBeTruthy();
  }));
});
