import { TestBed, inject } from '@angular/core/testing';

import { NumeracionVentasService } from './numeracion-ventas.service';

describe('NumeracionVentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumeracionVentasService]
    });
  });

  it('should be created', inject([NumeracionVentasService], (service: NumeracionVentasService) => {
    expect(service).toBeTruthy();
  }));
});
