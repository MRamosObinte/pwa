import { TestBed, inject } from '@angular/core/testing';

import { SustentosTributariosService } from './sustentos-tributarios.service';

describe('SustentosTributariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SustentosTributariosService]
    });
  });

  it('should be created', inject([SustentosTributariosService], (service: SustentosTributariosService) => {
    expect(service).toBeTruthy();
  }));
});
