import { TestBed, inject } from '@angular/core/testing';

import { SaldoBodegaService } from './saldo-bodega.service';

describe('SaldoBodegaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaldoBodegaService]
    });
  });

  it('should be created', inject([SaldoBodegaService], (service: SaldoBodegaService) => {
    expect(service).toBeTruthy();
  }));
});
