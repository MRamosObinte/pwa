import { TestBed, inject } from '@angular/core/testing';

import { XivSueldoListadoService } from './xiv-sueldo-listado.service';

describe('XivSueldoListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XivSueldoListadoService]
    });
  });

  it('should be created', inject([XivSueldoListadoService], (service: XivSueldoListadoService) => {
    expect(service).toBeTruthy();
  }));
});
