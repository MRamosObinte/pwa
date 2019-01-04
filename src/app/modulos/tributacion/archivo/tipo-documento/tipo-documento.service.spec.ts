import { TestBed, inject } from '@angular/core/testing';

import { TipoDocumentoService } from './tipo-documento.service';

describe('TipoDocumentoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoDocumentoService]
    });
  });

  it('should be created', inject([TipoDocumentoService], (service: TipoDocumentoService) => {
    expect(service).toBeTruthy();
  }));
});
