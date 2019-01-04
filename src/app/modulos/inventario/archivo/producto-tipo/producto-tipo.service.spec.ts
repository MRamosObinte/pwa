import { TestBed, inject } from '@angular/core/testing';

import { ProductoTipoService } from './producto-tipo.service';

describe('ProductoTipoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoTipoService]
    });
  });

  it('should be created', inject([ProductoTipoService], (service: ProductoTipoService) => {
    expect(service).toBeTruthy();
  }));
});
