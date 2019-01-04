import { TestBed, inject } from '@angular/core/testing';

import { CambioChequeRectificaContableService } from './cambio-cheque-rectifica-contable.service';

describe('CambioChequeRectificaContableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CambioChequeRectificaContableService]
    });
  });

  it('should be created', inject([CambioChequeRectificaContableService], (service: CambioChequeRectificaContableService) => {
    expect(service).toBeTruthy();
  }));
});
