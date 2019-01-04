import { TestBed, inject } from '@angular/core/testing';

import { MotivoUtilidadService } from './motivo-utilidad.service';

describe('MotivoUtilidadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotivoUtilidadService]
    });
  });

  it('should be created', inject([MotivoUtilidadService], (service: MotivoUtilidadService) => {
    expect(service).toBeTruthy();
  }));
});
