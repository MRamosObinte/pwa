import { TestBed } from '@angular/core/testing';

import { CorridaFormularioService } from './corrida-formulario.service';

describe('CorridaFormularioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorridaFormularioService = TestBed.get(CorridaFormularioService);
    expect(service).toBeTruthy();
  });
});
