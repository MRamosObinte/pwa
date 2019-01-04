import { TestBed, inject } from '@angular/core/testing';

import { ConsumosPiscinaService } from './consumos-piscina.service';

describe('ConsumosPiscinaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosPiscinaService]
    });
  });

  it('should be created', inject([ConsumosPiscinaService], (service: ConsumosPiscinaService) => {
    expect(service).toBeTruthy();
  }));
});
