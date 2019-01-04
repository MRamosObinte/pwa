import { TestBed } from '@angular/core/testing';

import { ProductosPescaService } from './productos-pesca.service';

describe('ProductosPescaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductosPescaService = TestBed.get(ProductosPescaService);
    expect(service).toBeTruthy();
  });
});
