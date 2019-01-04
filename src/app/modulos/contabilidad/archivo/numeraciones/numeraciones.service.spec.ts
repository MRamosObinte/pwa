import { TestBed, inject } from '@angular/core/testing';

import { NumeracionesService } from './numeraciones.service';

describe('NumeracionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumeracionesService]
    });
  });

  it('should be created', inject([NumeracionesService], (service: NumeracionesService) => {
    expect(service).toBeTruthy();
  }));
});
