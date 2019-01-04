import { TestBed, inject } from '@angular/core/testing';

import { XiiiSueldoListadoService } from './xiii-sueldo-listado.service';

describe('XiiiSueldoListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XiiiSueldoListadoService]
    });
  });

  it('should be created', inject([XiiiSueldoListadoService], (service: XiiiSueldoListadoService) => {
    expect(service).toBeTruthy();
  }));
});
