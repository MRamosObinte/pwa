import { TestBed, inject } from '@angular/core/testing';

import { ChequesNoEntregadosService } from './cheques-no-entregados.service';

describe('ChequesNoEntregadosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChequesNoEntregadosService]
    });
  });

  it('should be created', inject([ChequesNoEntregadosService], (service: ChequesNoEntregadosService) => {
    expect(service).toBeTruthy();
  }));
});
