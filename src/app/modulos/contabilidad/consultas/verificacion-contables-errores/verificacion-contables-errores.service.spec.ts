import { TestBed, inject } from '@angular/core/testing';

import { VerificacionContablesErroresService } from './verificacion-contables-errores.service';

describe('VerificacionContablesErroresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerificacionContablesErroresService]
    });
  });

  it('should be created', inject([VerificacionContablesErroresService], (service: VerificacionContablesErroresService) => {
    expect(service).toBeTruthy();
  }));
});
