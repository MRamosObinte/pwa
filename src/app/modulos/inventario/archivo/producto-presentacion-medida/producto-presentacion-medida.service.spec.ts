import { TestBed, inject } from '@angular/core/testing';

import { ProductoPresentacionMedidaService } from './producto-presentacion-medida.service';

describe('ProductoPresentacionMedidaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoPresentacionMedidaService]
    });
  });

  it('should be created', inject([ProductoPresentacionMedidaService], (service: ProductoPresentacionMedidaService) => {
    expect(service).toBeTruthy();
  }));
});
