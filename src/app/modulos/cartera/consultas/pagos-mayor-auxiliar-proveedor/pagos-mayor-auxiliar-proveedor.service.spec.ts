import { TestBed } from '@angular/core/testing';

import { PagosMayorAuxiliarProveedorService } from './pagos-mayor-auxiliar-proveedor.service';

describe('PagosMayorAuxiliarProveedorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagosMayorAuxiliarProveedorService = TestBed.get(PagosMayorAuxiliarProveedorService);
    expect(service).toBeTruthy();
  });
});
