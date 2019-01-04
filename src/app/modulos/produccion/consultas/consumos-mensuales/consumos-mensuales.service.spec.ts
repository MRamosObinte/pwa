import { TestBed, inject } from '@angular/core/testing';

import { ConsumosMensualesService } from './consumos-mensuales.service';

describe('ConsumosMensualesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosMensualesService]
    });
  });

  it('should be created', inject([ConsumosMensualesService], (service: ConsumosMensualesService) => {
    expect(service).toBeTruthy();
  }));
});
