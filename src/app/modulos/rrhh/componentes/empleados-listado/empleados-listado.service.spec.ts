import { TestBed, inject } from '@angular/core/testing';

import { EmpleadosListadoService } from './empleados-listado.service';

describe('EmpleadosListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmpleadosListadoService]
    });
  });

  it('should be created', inject([EmpleadosListadoService], (service: EmpleadosListadoService) => {
    expect(service).toBeTruthy();
  }));
});
