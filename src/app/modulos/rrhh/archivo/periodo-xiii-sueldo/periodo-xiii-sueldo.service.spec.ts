import { TestBed, inject } from '@angular/core/testing';

import { PeriodoXiiiSueldoService } from './periodo-xiii-sueldo.service';

describe('PeriodoXiiiSueldoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodoXiiiSueldoService]
    });
  });

  it('should be created', inject([PeriodoXiiiSueldoService], (service: PeriodoXiiiSueldoService) => {
    expect(service).toBeTruthy();
  }));
});
