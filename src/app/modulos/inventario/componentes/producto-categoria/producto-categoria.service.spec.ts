import { TestBed, inject } from '@angular/core/testing';

import { ProductoCategoriaService } from './producto-categoria.service';

describe('ProductoCategoriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductoCategoriaService]
    });
  });

  it('should be created', inject([ProductoCategoriaService], (service: ProductoCategoriaService) => {
    expect(service).toBeTruthy();
  }));
});
