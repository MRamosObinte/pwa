import { TestBed } from '@angular/core/testing';

import { GrameajeService } from './grameaje.service';

describe('GrameajeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GrameajeService = TestBed.get(GrameajeService);
    expect(service).toBeTruthy();
  });
});
