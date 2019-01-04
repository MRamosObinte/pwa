import { TestBed, inject } from '@angular/core/testing';

import { OrdenPedidoService } from './orden-pedido.service';

describe('OrdenPedidoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenPedidoService]
    });
  });

  it('should be created', inject([OrdenPedidoService], (service: OrdenPedidoService) => {
    expect(service).toBeTruthy();
  }));
});
