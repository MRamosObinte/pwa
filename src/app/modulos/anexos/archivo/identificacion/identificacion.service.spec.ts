import { TestBed, inject } from '@angular/core/testing';

import { IdentificacionService } from './identificacion.service';

describe('IdentificacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdentificacionService]
    });
  });

  it('should be created', inject([IdentificacionService], (service: IdentificacionService) => {
    expect(service).toBeTruthy();
  }));
});
