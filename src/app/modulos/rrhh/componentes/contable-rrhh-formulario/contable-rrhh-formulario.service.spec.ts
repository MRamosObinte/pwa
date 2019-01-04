import { TestBed } from '@angular/core/testing';

import { ContableRrhhFormularioService } from './contable-rrhh-formulario.service';

describe('ContableRrhhFormularioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContableRrhhFormularioService = TestBed.get(ContableRrhhFormularioService);
    expect(service).toBeTruthy();
  });
});
