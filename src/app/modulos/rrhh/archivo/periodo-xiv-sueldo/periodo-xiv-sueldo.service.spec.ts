import { TestBed, inject } from '@angular/core/testing';

import { PeriodoXivSueldoService } from './periodo-xiv-sueldo.service';

describe('PeriodoXivSueldoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodoXivSueldoService]
    });
  });

  it('should be created', inject([PeriodoXivSueldoService], (service: PeriodoXivSueldoService) => {
    expect(service).toBeTruthy();
  }));
});
