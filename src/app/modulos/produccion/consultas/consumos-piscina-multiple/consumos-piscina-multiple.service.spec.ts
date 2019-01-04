import { TestBed, inject } from '@angular/core/testing';

import { ConsumosPiscinaMultipleService } from './consumos-piscina-multiple.service';

describe('ConsumosPiscinaMultipleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosPiscinaMultipleService]
    });
  });

  it('should be created', inject([ConsumosPiscinaMultipleService], (service: ConsumosPiscinaMultipleService) => {
    expect(service).toBeTruthy();
  }));
});
