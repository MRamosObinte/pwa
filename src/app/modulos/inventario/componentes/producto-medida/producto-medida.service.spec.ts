import { TestBed, inject } from '@angular/core/testing';

import { ProductoMedidaService } from './producto-medida.service';

describe('ProductoMedidaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoMedidaService]
    });
  });

  it('should be created', inject([ProductoMedidaService], (service: ProductoMedidaService) => {
    expect(service).toBeTruthy();
  }));
});
