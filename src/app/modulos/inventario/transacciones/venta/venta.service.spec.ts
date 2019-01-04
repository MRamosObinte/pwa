import { TestBed, inject } from '@angular/core/testing';

import { VentaService } from './venta.service';

describe('VentaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentaService]
    });
  });

  it('should be created', inject([VentaService], (service: VentaService) => {
    expect(service).toBeTruthy();
  }));
});
