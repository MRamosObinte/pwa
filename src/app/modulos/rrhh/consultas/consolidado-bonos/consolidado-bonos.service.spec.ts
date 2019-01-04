import { TestBed } from '@angular/core/testing';

import { ConsolidadoBonosService } from './consolidado-bonos.service';

describe('ConsolidadoBonosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsolidadoBonosService = TestBed.get(ConsolidadoBonosService);
    expect(service).toBeTruthy();
  });
});
