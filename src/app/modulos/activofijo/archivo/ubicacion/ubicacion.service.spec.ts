import { TestBed, inject } from '@angular/core/testing';

import { UbicacionService } from './ubicacion.service';

describe('UbicacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UbicacionService]
    });
  });

  it('should be created', inject([UbicacionService], (service: UbicacionService) => {
    expect(service).toBeTruthy();
  }));
});
