import { TestBed, inject } from '@angular/core/testing';

import { PeriodoUtilidadService } from './periodo-utilidad.service';

describe('PeriodoUtilidadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodoUtilidadService]
    });
  });

  it('should be created', inject([PeriodoUtilidadService], (service: PeriodoUtilidadService) => {
    expect(service).toBeTruthy();
  }));
});
