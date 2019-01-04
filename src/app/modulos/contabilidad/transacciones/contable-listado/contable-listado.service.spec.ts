import { TestBed, inject } from '@angular/core/testing';

import { ContableListadoService } from './contable-listado.service';

describe('ContableListadoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContableListadoService]
    });
  });

  it('should be created', inject([ContableListadoService], (service: ContableListadoService) => {
    expect(service).toBeTruthy();
  }));
});
