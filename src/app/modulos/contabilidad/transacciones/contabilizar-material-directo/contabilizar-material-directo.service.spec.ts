import { TestBed, inject } from '@angular/core/testing';

import { ContabilizarMaterialDirectoService } from './contabilizar-material-directo.service';

describe('ContabilizarMaterialDirectoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContabilizarMaterialDirectoService]
    });
  });

  it('should be created', inject([ContabilizarMaterialDirectoService], (service: ContabilizarMaterialDirectoService) => {
    expect(service).toBeTruthy();
  }));
});
