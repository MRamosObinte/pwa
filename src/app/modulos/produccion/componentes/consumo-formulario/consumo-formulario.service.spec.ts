import { TestBed, inject } from '@angular/core/testing';

import { ConsumoFormularioService } from './consumo-formulario.service';

describe('ConsumoFormularioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumoFormularioService]
    });
  });

  it('should be created', inject([ConsumoFormularioService], (service: ConsumoFormularioService) => {
    expect(service).toBeTruthy();
  }));
});
