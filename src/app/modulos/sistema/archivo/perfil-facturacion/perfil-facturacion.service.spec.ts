import { TestBed, inject } from '@angular/core/testing';

import { PerfilFacturacionService } from './perfil-facturacion.service';

describe('PerfilFacturacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerfilFacturacionService]
    });
  });

  it('should be created', inject([PerfilFacturacionService], (service: PerfilFacturacionService) => {
    expect(service).toBeTruthy();
  }));
});
