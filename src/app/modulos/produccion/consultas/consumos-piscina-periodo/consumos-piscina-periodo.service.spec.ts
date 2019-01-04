import { TestBed, inject } from '@angular/core/testing';

import { ConsumosPiscinaPeriodoService } from './consumos-piscina-periodo.service';

describe('ConsumosPiscinaPeriodoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosPiscinaPeriodoService]
    });
  });

  it('should be created', inject([ConsumosPiscinaPeriodoService], (service: ConsumosPiscinaPeriodoService) => {
    expect(service).toBeTruthy();
  }));
});
