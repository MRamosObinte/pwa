import { TestBed, inject } from '@angular/core/testing';

import { ContabilizarIppCierreCorridasService } from './contabilizar-ipp-cierre-corridas.service';

describe('ContabilizarIppCierreCorridasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContabilizarIppCierreCorridasService]
    });
  });

  it('should be created', inject([ContabilizarIppCierreCorridasService], (service: ContabilizarIppCierreCorridasService) => {
    expect(service).toBeTruthy();
  }));
});
