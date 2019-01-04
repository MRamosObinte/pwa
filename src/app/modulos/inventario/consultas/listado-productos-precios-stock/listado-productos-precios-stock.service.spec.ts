import { TestBed, inject } from '@angular/core/testing';

import { ListadoProductosPreciosStockService } from './listado-productos-precios-stock.service';

describe('ListadoProductosPreciosStockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoProductosPreciosStockService]
    });
  });

  it('should be created', inject([ListadoProductosPreciosStockService], (service: ListadoProductosPreciosStockService) => {
    expect(service).toBeTruthy();
  }));
});
