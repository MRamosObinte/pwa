import { TestBed, inject } from '@angular/core/testing';

import { RetencionesEmitidasService } from './retenciones-emitidas.service';

describe('RetencionesEmitidasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetencionesEmitidasService]
    });
  });

  it('should be created', inject([RetencionesEmitidasService], (service: RetencionesEmitidasService) => {
    expect(service).toBeTruthy();
  }));
});
