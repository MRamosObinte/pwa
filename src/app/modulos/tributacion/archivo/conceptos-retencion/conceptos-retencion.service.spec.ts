import { TestBed, inject } from '@angular/core/testing';

import { ConceptosRetencionService } from './conceptos-retencion.service';

describe('ConceptosRetencionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConceptosRetencionService]
    });
  });

  it('should be created', inject([ConceptosRetencionService], (service: ConceptosRetencionService) => {
    expect(service).toBeTruthy();
  }));
});
