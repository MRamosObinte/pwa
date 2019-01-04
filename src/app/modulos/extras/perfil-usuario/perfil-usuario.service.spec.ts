import { TestBed, inject } from '@angular/core/testing';

import { PerfilUsuarioService } from './perfil-usuario.service';

describe('PerfilUsuarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerfilUsuarioService]
    });
  });

  it('should be created', inject([PerfilUsuarioService], (service: PerfilUsuarioService) => {
    expect(service).toBeTruthy();
  }));
});
