import { TestBed, inject } from '@angular/core/testing';

import { ConsumosFechaService } from './consumos-fecha.service';

describe('ConsumosFechaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumosFechaService]
    });
  });

  it('should be created', inject([ConsumosFechaService], (service: ConsumosFechaService) => {
    expect(service).toBeTruthy();
  }));
});
