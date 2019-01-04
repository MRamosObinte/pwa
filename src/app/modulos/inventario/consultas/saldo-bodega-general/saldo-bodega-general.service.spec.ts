import { TestBed, inject } from '@angular/core/testing';

import { SaldoBodegaGeneralService } from './saldo-bodega-general.service';

describe('SaldoBodegaGeneralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoBodegaGeneralService]
    });
  });

  it('should be created', inject([SaldoBodegaGeneralService], (service: SaldoBodegaGeneralService) => {
    expect(service).toBeTruthy();
  }));
});
