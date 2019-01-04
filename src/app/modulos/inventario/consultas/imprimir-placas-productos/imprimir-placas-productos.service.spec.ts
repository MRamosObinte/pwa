import { TestBed, inject } from '@angular/core/testing';

import { ImprimirPlacasProductosService } from './imprimir-placas-productos.service';

describe('ImprimirPlacasProductosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImprimirPlacasProductosService]
    });
  });

  it('should be created', inject([ImprimirPlacasProductosService], (service: ImprimirPlacasProductosService) => {
    expect(service).toBeTruthy();
  }));
});
