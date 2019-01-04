import { TestBed, inject } from '@angular/core/testing';

import { CostosPiscinaService } from './costos-piscina.service';

describe('CostosPiscinaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostosPiscinaService]
    });
  });

  it('should be created', inject([CostosPiscinaService], (service: CostosPiscinaService) => {
    expect(service).toBeTruthy();
  }));
});
