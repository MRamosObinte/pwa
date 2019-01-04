import { TestBed, inject } from '@angular/core/testing';

import { TipoIdentificacionService } from './tipo-identificacion.service';

describe('TipoIdentificacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoIdentificacionService]
    });
  });

  it('should be created', inject([TipoIdentificacionService], (service: TipoIdentificacionService) => {
    expect(service).toBeTruthy();
  }));
});
