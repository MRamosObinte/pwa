import { TestBed, inject } from '@angular/core/testing';

import { GrupoClasificacionService } from './grupo-clasificacion.service';

describe('GrupoClasificacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrupoClasificacionService]
    });
  });

  it('should be created', inject([GrupoClasificacionService], (service: GrupoClasificacionService) => {
    expect(service).toBeTruthy();
  }));
});
