import { TestBed, inject } from '@angular/core/testing';

import { VentasElectronicasEmitidasService } from './ventas-electronicas-emitidas.service';

describe('VentasElectronicasEmitidasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentasElectronicasEmitidasService]
    });
  });

  it('should be created', inject([VentasElectronicasEmitidasService], (service: VentasElectronicasEmitidasService) => {
    expect(service).toBeTruthy();
  }));
});
