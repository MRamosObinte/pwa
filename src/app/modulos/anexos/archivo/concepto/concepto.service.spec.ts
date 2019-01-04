import { TestBed, inject } from '@angular/core/testing';

import { ConceptoService } from './concepto.service';

describe('ConceptoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConceptoService]
    });
  });

  it('should be created', inject([ConceptoService], (service: ConceptoService) => {
    expect(service).toBeTruthy();
  }));
});
