import { TestBed, inject } from '@angular/core/testing';

import { UtilidadDiariaService } from './utilidad-diaria.service';

describe('UtilidadDiariaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilidadDiariaService]
    });
  });

  it('should be created', inject([UtilidadDiariaService], (service: UtilidadDiariaService) => {
    expect(service).toBeTruthy();
  }));
});
