import { TestBed, inject } from '@angular/core/testing';

import { ProveedorCategoriaService } from './proveedor-categoria.service';

describe('ProveedorCategoriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProveedorCategoriaService]
    });
  });

  it('should be created', inject([ProveedorCategoriaService], (service: ProveedorCategoriaService) => {
    expect(service).toBeTruthy();
  }));
});
