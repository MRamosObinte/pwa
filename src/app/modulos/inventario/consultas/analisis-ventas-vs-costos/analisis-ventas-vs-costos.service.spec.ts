import { TestBed, inject } from '@angular/core/testing';

import { AnalisisVentasVsCostosService } from './analisis-ventas-vs-costos.service';

describe('AnalisisVentasVsCostosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalisisVentasVsCostosService]
    });
  });

  it('should be created', inject([AnalisisVentasVsCostosService], (service: AnalisisVentasVsCostosService) => {
    expect(service).toBeTruthy();
  }));
});
