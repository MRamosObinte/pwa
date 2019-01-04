import { TestBed } from '@angular/core/testing';

import { ProductoEtiquetasService } from './producto-etiquetas.service';

describe('ProductoEtiquetasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductoEtiquetasService = TestBed.get(ProductoEtiquetasService);
    expect(service).toBeTruthy();
  });
});
