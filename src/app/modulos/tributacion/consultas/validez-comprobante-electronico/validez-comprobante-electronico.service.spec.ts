import { TestBed, inject } from '@angular/core/testing';

import { ValidezComprobanteElectronicoService } from './validez-comprobante-electronico.service';

describe('ValidezComprobanteElectronicoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidezComprobanteElectronicoService]
    });
  });

  it('should be created', inject([ValidezComprobanteElectronicoService], (service: ValidezComprobanteElectronicoService) => {
    expect(service).toBeTruthy();
  }));
});
