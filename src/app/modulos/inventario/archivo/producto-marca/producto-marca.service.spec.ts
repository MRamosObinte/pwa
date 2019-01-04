import { TestBed, inject } from '@angular/core/testing';

import { ProductoMarcaService } from './producto-marca.service';

describe('ProductoMarcaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoMarcaService]
    });
  });

  it('should be created', inject([ProductoMarcaService], (service: ProductoMarcaService) => {
    expect(service).toBeTruthy();
  }));
});
