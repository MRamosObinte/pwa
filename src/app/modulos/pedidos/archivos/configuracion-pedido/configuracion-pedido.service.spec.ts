import { TestBed, inject } from '@angular/core/testing';

import { ConfiguracionPedidoService } from './configuracion-pedido.service';

describe('ConfiguracionPedidoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfiguracionPedidoService]
    });
  });

  it('should be created', inject([ConfiguracionPedidoService], (service: ConfiguracionPedidoService) => {
    expect(service).toBeTruthy();
  }));
});
