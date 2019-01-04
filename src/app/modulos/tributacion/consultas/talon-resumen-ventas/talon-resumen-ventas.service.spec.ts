import { TestBed, inject } from '@angular/core/testing';

import { TalonResumenVentasService } from './talon-resumen-ventas.service';

describe('TalonResumenVentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TalonResumenVentasService]
    });
  });

  it('should be created', inject([TalonResumenVentasService], (service: TalonResumenVentasService) => {
    expect(service).toBeTruthy();
  }));
});
