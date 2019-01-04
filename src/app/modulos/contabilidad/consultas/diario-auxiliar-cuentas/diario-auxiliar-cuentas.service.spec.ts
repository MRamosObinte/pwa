import { TestBed, inject } from '@angular/core/testing';

import { DiarioAuxiliarCuentasService } from './diario-auxiliar-cuentas.service';

describe('DiarioAuxiliarCuentasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DiarioAuxiliarCuentasService]
    });
  });

  it('should be created', inject([DiarioAuxiliarCuentasService], (service: DiarioAuxiliarCuentasService) => {
    expect(service).toBeTruthy();
  }));
});
