import { TestBed, inject } from '@angular/core/testing';

import { ConfiguracionOrdenCompraService } from './configuracion-orden-compra.service';

describe('ConfiguracionOrdenCompraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfiguracionOrdenCompraService]
    });
  });

  it('should be created', inject([ConfiguracionOrdenCompraService], (service: ConfiguracionOrdenCompraService) => {
    expect(service).toBeTruthy();
  }));
});
