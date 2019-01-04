import { TestBed, inject } from '@angular/core/testing';

import { TalonResumenComprasService } from './talon-resumen-compras.service';

describe('TalonResumenComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TalonResumenComprasService]
    });
  });

  it('should be created', inject([TalonResumenComprasService], (service: TalonResumenComprasService) => {
    expect(service).toBeTruthy();
  }));
});
