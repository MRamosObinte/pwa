import { TestBed, inject } from '@angular/core/testing';

import { ActivosFijosService } from './activos-fijos.service';

describe('ActivosFijosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivosFijosService]
    });
  });

  it('should be created', inject([ActivosFijosService], (service: ActivosFijosService) => {
    expect(service).toBeTruthy();
  }));
});
