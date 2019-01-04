import { TestBed, inject } from '@angular/core/testing';

import { CambioChequeGeneraContableService } from './cambio-cheque-genera-contable.service';

describe('CambioChequeGeneraContableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambioChequeGeneraContableService]
    });
  });

  it('should be created', inject([CambioChequeGeneraContableService], (service: CambioChequeGeneraContableService) => {
    expect(service).toBeTruthy();
  }));
});
