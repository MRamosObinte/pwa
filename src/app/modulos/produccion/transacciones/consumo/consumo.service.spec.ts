import { TestBed, inject } from '@angular/core/testing';

import { ConsumoService } from './consumo.service';

describe('ConsumoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumoService]
    });
  });

  it('should be created', inject([ConsumoService], (service: ConsumoService) => {
    expect(service).toBeTruthy();
  }));
});
