import { TestBed, inject } from '@angular/core/testing';

import { VacacionesService } from './vacaciones.service';

describe('VacacionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacacionesService]
    });
  });

  it('should be created', inject([VacacionesService], (service: VacacionesService) => {
    expect(service).toBeTruthy();
  }));
});
