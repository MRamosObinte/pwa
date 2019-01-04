import { TestBed, inject } from '@angular/core/testing';

import { RetencionesIvaComprasService } from './retenciones-iva-compras.service';

describe('RetencionesIvaComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesIvaComprasService]
    });
  });

  it('should be created', inject([RetencionesIvaComprasService], (service: RetencionesIvaComprasService) => {
    expect(service).toBeTruthy();
  }));
});
