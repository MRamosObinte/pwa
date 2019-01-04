import { TestBed, inject } from '@angular/core/testing';

import { ChequesNoImpresosService } from './cheques-no-impresos.service';

describe('ChequesNoImpresosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChequesNoImpresosService]
    });
  });

  it('should be created', inject([ChequesNoImpresosService], (service: ChequesNoImpresosService) => {
    expect(service).toBeTruthy();
  }));
});
