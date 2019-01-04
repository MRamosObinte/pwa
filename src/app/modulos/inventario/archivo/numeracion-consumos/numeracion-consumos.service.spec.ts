import { TestBed, inject } from '@angular/core/testing';

import { NumeracionConsumosService } from './numeracion-consumos.service';

describe('NumeracionConsumosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumeracionConsumosService]
    });
  });

  it('should be created', inject([NumeracionConsumosService], (service: NumeracionConsumosService) => {
    expect(service).toBeTruthy();
  }));
});
