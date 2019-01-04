import { TestBed, inject } from '@angular/core/testing';

import { ListadoProveedorService } from './listado-proveedor.service';

describe('ListadoProveedorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListadoProveedorService]
    });
  });

  it('should be created', inject([ListadoProveedorService], (service: ListadoProveedorService) => {
    expect(service).toBeTruthy();
  }));
});
