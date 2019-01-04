import { TestBed, inject } from '@angular/core/testing';

import { NumeracionComprasService } from './numeracion-compras.service';

describe('NumeracionComprasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumeracionComprasService]
    });
  });

  it('should be created', inject([NumeracionComprasService], (service: NumeracionComprasService) => {
    expect(service).toBeTruthy();
  }));
});
