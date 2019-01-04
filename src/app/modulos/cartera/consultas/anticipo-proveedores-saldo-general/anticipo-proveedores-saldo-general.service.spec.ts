import { TestBed } from '@angular/core/testing';

import { AnticipoProveedoresSaldoGeneralService } from './anticipo-proveedores-saldo-general.service';

describe('AnticipoProveedoresSaldoGeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnticipoProveedoresSaldoGeneralService = TestBed.get(AnticipoProveedoresSaldoGeneralService);
    expect(service).toBeTruthy();
  });
});
