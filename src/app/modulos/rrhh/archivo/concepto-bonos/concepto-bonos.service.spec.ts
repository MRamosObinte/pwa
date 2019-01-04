import { TestBed, inject } from '@angular/core/testing';

import { ConceptoBonosService } from './concepto-bonos.service';

describe('ConceptoBonosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConceptoBonosService]
    });
  });

  it('should be created', inject([ConceptoBonosService], (service: ConceptoBonosService) => {
    expect(service).toBeTruthy();
  }));
});
