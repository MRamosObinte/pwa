import { TestBed, inject } from '@angular/core/testing';

import { ChequeImpresionService } from './cheque-impresion.service';

describe('ChequeImpresionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChequeImpresionService]
    });
  });

  it('should be created', inject([ChequeImpresionService], (service: ChequeImpresionService) => {
    expect(service).toBeTruthy();
  }));
});
