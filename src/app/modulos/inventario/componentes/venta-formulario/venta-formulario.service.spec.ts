import { TestBed, inject } from '@angular/core/testing';

import { VentaFormularioService } from './venta-formulario.service';

describe('VentaFormularioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentaFormularioService]
    });
  });

  it('should be created', inject([VentaFormularioService], (service: VentaFormularioService) => {
    expect(service).toBeTruthy();
  }));
});
