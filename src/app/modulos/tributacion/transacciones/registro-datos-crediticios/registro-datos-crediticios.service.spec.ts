import { TestBed, inject } from '@angular/core/testing';

import { RegistroDatosCrediticiosService } from './registro-datos-crediticios.service';

describe('RegistroDatosCrediticiosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistroDatosCrediticiosService]
    });
  });

  it('should be created', inject([RegistroDatosCrediticiosService], (service: RegistroDatosCrediticiosService) => {
    expect(service).toBeTruthy();
  }));
});
