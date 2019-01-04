import { TestBed, inject } from '@angular/core/testing';

import { ChequesNoRevisadosService } from './cheques-no-revisados.service';

describe('ChequesNoRevisadosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChequesNoRevisadosService]
    });
  });

  it('should be created', inject([ChequesNoRevisadosService], (service: ChequesNoRevisadosService) => {
    expect(service).toBeTruthy();
  }));
});
