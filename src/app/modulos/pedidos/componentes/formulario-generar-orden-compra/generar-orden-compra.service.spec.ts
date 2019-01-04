import { TestBed, inject } from '@angular/core/testing';

import { GenerarOrdenCompraService } from './generar-orden-compra.service';

describe('GenerarOrdenCompraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenerarOrdenCompraService]
    });
  });

  it('should be created', inject([GenerarOrdenCompraService], (service: GenerarOrdenCompraService) => {
    expect(service).toBeTruthy();
  }));
});
