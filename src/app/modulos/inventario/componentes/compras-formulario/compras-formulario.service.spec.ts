import { TestBed } from '@angular/core/testing';

import { ComprasFormularioService } from './compras-formulario.service';

describe('ComprasFormularioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComprasFormularioService = TestBed.get(ComprasFormularioService);
    expect(service).toBeTruthy();
  });
});
