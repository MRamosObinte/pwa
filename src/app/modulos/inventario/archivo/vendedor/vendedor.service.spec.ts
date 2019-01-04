import { TestBed, inject } from '@angular/core/testing';

import { VendedorService } from './vendedor.service';

describe('VendedorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendedorService]
    });
  });

  it('should be created', inject([VendedorService], (service: VendedorService) => {
    expect(service).toBeTruthy();
  }));
});
