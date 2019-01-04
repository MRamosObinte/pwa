import { TestBed, inject } from '@angular/core/testing';

import { OrdenCompraService } from './orden-compra.service';

describe('OrdenCompraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenCompraService]
    });
  });

  it('should be created', inject([OrdenCompraService], (service: OrdenCompraService) => {
    expect(service).toBeTruthy();
  }));
});
