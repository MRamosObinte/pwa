import { TestBed, inject } from '@angular/core/testing';

import { UtilidadesPrecalculadasService } from './utilidades-precalculadas.service';

describe('UtilidadesPrecalculadasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilidadesPrecalculadasService]
    });
  });

  it('should be created', inject([UtilidadesPrecalculadasService], (service: UtilidadesPrecalculadasService) => {
    expect(service).toBeTruthy();
  }));
});
