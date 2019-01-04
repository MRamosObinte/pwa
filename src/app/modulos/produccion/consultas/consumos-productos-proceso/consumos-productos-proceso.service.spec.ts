import { TestBed, inject } from '@angular/core/testing';

import { ConsumosProductosProcesoService } from './consumos-productos-proceso.service';

describe('ConsumosProductosProcesoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosProductosProcesoService]
    });
  });

  it('should be created', inject([ConsumosProductosProcesoService], (service: ConsumosProductosProcesoService) => {
    expect(service).toBeTruthy();
  }));
});
