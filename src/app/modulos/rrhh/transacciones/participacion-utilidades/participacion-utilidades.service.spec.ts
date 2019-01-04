import { TestBed } from '@angular/core/testing';

import { ParticipacionUtilidadesService } from './participacion-utilidades.service';

describe('ParticipacionUtilidadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParticipacionUtilidadesService = TestBed.get(ParticipacionUtilidadesService);
    expect(service).toBeTruthy();
  });
});
